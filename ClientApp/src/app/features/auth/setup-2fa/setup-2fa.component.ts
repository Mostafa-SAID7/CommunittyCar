import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../core/services/api/auth-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-setup-2fa',
  templateUrl: './setup-2fa.component.html',
  styleUrls: ['./setup-2fa.component.scss']
})
export class Setup2faComponent implements OnInit {
  twoFactorForm: FormGroup;
  isLoading = false;
  qrCodeUrl = '';
  secret = '';
  step: 'enable' | 'verify' = 'enable';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authApiService: AuthApiService,
    private notificationService: NotificationService
  ) {
    this.twoFactorForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit(): void {
    this.enable2FA();
  }

  enable2FA(): void {
    this.isLoading = true;
    this.authApiService.enable2FA().subscribe({
      next: (response) => {
        if (response.success) {
          this.qrCodeUrl = response.qrCodeUrl || '';
          this.secret = response.secret || '';
          this.step = 'enable';
        } else {
          this.notificationService.showError(response.message || 'Failed to enable 2FA');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to enable 2FA');
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.twoFactorForm.valid) {
      this.isLoading = true;
      this.authApiService.verify2FA(this.twoFactorForm.value.code).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.showSuccess('2FA setup completed successfully!');
            // Clear temporary token
            localStorage.removeItem('temp_token');
            this.router.navigate(['/dashboard']);
          } else {
            this.notificationService.showError(response.message || 'Invalid verification code');
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.notificationService.showError('Invalid verification code');
          this.isLoading = false;
        }
      });
    } else {
      this.twoFactorForm.get('code')?.markAsTouched();
    }
  }

  onCodeInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    this.twoFactorForm.patchValue({ code: value });
  }

  skip2FA(): void {
    // Store that user skipped 2FA for later
    localStorage.setItem('skipped_2fa', 'true');
    this.router.navigate(['/dashboard']);
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}