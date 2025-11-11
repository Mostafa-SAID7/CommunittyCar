import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { emailValidator } from '../../../core/utilities/validators';
import { LoginRequest } from '../../../core/models/auth.model';
import { environment } from '../../../../environments/environment';
import { IconComponent } from '../../../shared/components/icons/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showSocialLogin = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, emailValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginData: LoginRequest = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Login successful!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.notificationService.showError('Login failed. Please check your credentials.');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  loginWithGoogle(): void {
    // Implement Google OAuth login
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  loginWithFacebook(): void {
    // Implement Facebook OAuth login
    window.location.href = `${environment.apiUrl}/auth/facebook`;
  }

  loginWithTwitter(): void {
    // Implement Twitter OAuth login
    window.location.href = `${environment.apiUrl}/auth/twitter`;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
