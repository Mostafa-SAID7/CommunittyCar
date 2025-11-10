import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials);
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', userData);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post('/api/auth/forgot-password', { email });
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post('/api/auth/verify-email', { token });
  }

  otpVerification(email: string, otp: string): Observable<any> {
    return this.http.post('/api/auth/otp-verification', { email, otp });
  }
}