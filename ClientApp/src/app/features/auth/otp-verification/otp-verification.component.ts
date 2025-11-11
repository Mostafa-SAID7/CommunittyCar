import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from '../../../core/services/api/auth-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  otpForm: FormGroup;
  isLoading = false;
  email = '';
  resendDisabled = false;
  countdown = 0;
  private countdownInterval: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authApiService: AuthApiService,
    private notificationService: NotificationService
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] || '';
    if (!this.email) {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  onOtpInput(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    this.otpForm.patchValue({ otp: value });
  }

  onSubmit(): void {
    if (this.otpForm.valid) {
      this.isLoading = true;
      this.authApiService.verifyOtp(this.email, this.otpForm.value.otp).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.showSuccess('OTP verified successfully!');
            // Check if token is provided for 2FA setup
            if (response.token) {
              // Store temporary token for 2FA setup
              localStorage.setItem('temp_token', response.token);
              this.router.navigate(['/setup-2fa']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          } else {
            this.notificationService.showError(response.message || 'Invalid OTP. Please try again.');
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.notificationService.showError('Invalid OTP. Please try again.');
          this.isLoading = false;
        }
      });
    } else {
      this.otpForm.get('otp')?.markAsTouched();
    }
  }

  resendOtp(): void {
    if (this.resendDisabled) return;

    this.authApiService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('OTP sent successfully!');
        this.startCountdown();
      },
      error: (error) => {
        this.notificationService.showError('Failed to resend OTP. Please try again.');
      }
    });
  }

  private startCountdown(): void {
    this.resendDisabled = true;
    this.countdown = 60;

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.resendDisabled = false;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}