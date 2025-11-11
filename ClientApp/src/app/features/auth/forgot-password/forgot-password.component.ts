import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../core/services/api/auth-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { emailValidator } from '../../../core/utilities/validators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private authApiService: AuthApiService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, emailValidator()]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.authApiService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
        next: (response) => {
          this.emailSent = true;
          this.notificationService.showSuccess('Password reset email sent! Please check your inbox.');
        },
        error: (error) => {
          this.notificationService.showError('Failed to send reset email. Please try again.');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.forgotPasswordForm.get('email')?.markAsTouched();
    }
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}