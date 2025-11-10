import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, LoginRequest } from '../../../services/api.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const credentials: LoginRequest = this.loginForm.value;

      this.apiService.login(credentials).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);

          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });

          // Redirect to return URL or dashboard
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', { duration: 5000 });
        }
      });
    }
  }

  navigateToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
