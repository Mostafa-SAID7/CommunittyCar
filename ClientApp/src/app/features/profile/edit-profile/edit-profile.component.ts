import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileApiService } from '../../../core/services/api/profile-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';
import { emailValidator, phoneNumberValidator } from '../../../core/utilities/validators';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = false;
  isSaving = false;
  profileForm: FormGroup;
  selectedFile: File | null = null;
  selectedCoverFile: File | null = null;
  previewUrl: string | null = null;
  coverPreviewUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private profileApi: ProfileApiService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, emailValidator()]],
      phone: ['', [phoneNumberValidator()]],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
      })
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadProfile();
      }
    });
  }

  private loadProfile(): void {
    this.isLoading = true;
    this.profileApi.getMyProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          name: profile.name,
          email: profile.email,
          phone: profile.phone || '',
          address: profile.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          }
        });
        this.previewUrl = profile.avatar || null;
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load profile');
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onCoverFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedCoverFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverPreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  removeCoverPhoto(): void {
    this.selectedCoverFile = null;
    this.coverPreviewUrl = null;
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;

      const formData = this.profileForm.value;

      this.profileApi.updateProfile(formData).subscribe({
        next: (updatedProfile) => {
          // Upload avatar and cover photo if selected
          if (this.selectedFile || this.selectedCoverFile) {
            this.uploadFiles();
          } else {
            this.notificationService.showSuccess('Profile updated successfully');
            this.isSaving = false;
          }
        },
        error: (error) => {
          this.notificationService.showError('Failed to update profile');
          this.isSaving = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private uploadFiles(): void {
    let completedUploads = 0;
    const totalUploads = (this.selectedFile ? 1 : 0) + (this.selectedCoverFile ? 1 : 0);

    const checkCompletion = () => {
      completedUploads++;
      if (completedUploads === totalUploads) {
        this.notificationService.showSuccess('Profile and photos updated successfully');
        this.selectedFile = null;
        this.selectedCoverFile = null;
        this.isSaving = false;
      }
    };

    if (this.selectedFile) {
      this.profileApi.uploadAvatar(this.selectedFile).subscribe({
        next: () => checkCompletion(),
        error: () => {
          this.notificationService.showError('Avatar upload failed');
          checkCompletion();
        }
      });
    }

    if (this.selectedCoverFile) {
      this.profileApi.uploadCoverPhoto(this.selectedCoverFile).subscribe({
        next: () => checkCompletion(),
        error: () => {
          this.notificationService.showError('Cover photo upload failed');
          checkCompletion();
        }
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['invalidEmail']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['invalidPhoneNumber']) {
        return 'Please enter a valid phone number';
      }
    }
    return '';
  }
}
