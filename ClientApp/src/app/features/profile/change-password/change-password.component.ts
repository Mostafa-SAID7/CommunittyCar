import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthApiService } from '../../../core/services/api/auth-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { passwordMatchValidator } from '../../../core/utilities/validators';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private profileApi: AuthApiService,
    private notificationService: NotificationService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      const { currentPassword, newPassword } = this.changePasswordForm.value;

      this.profileApi.changePassword({
        currentPassword,
        newPassword
      }).subscribe({
        next: (response: any) => {
          this.notificationService.showSuccess('Password changed successfully');
          this.changePasswordForm.reset();
          this.isLoading = false;
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to change password. Please check your current password.');
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.changePasswordForm.controls).forEach(key => {
      const control = this.changePasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.changePasswordForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
      if (control.errors['minlength']) {
        return 'Password must be at least 8 characters long';
      }
    }

    // Check form-level errors
    if (this.changePasswordForm.errors?.['passwordMismatch'] && (fieldName === 'confirmPassword' || fieldName === 'newPassword')) {
      return 'Passwords do not match';
    }

    return '';
  }
}
