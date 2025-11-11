import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from '../../../core/services/api/auth-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  isLoading = true;
  isVerified = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authApiService: AuthApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      this.verifyEmail(token);
    } else {
      this.errorMessage = 'Verification token is missing.';
      this.isLoading = false;
    }
  }

  private verifyEmail(token: string): void {
    this.authApiService.verifyEmail(token).subscribe({
      next: (response) => {
        this.isVerified = true;
        this.notificationService.showSuccess('Email verified successfully! You can now log in.');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'Email verification failed. The link may be expired or invalid.';
        this.notificationService.showError(this.errorMessage);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  resendVerification(): void {
    // In a real app, you'd get the email from user input or stored data
    this.notificationService.showInfo('Please check your email for the verification link.');
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}