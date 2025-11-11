import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileApiService } from '../../../core/services/api/profile-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './view-profile.component.html',

})
export class ViewProfileComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = false;
  profileForm: FormGroup;

  constructor(
    private authService: AuthService,
    private profileApi: ProfileApiService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
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
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load profile');
        this.isLoading = false;
      }
    });
  }

  onEditProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  onChangePassword(): void {
    this.router.navigate(['/profile/change-password']);
  }
}
