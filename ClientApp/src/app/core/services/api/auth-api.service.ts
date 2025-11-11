import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../models/auth.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData);
  }

  generateOtp(email: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/auth/generate-otp`, { email });
  }

  verifyOtp(email: string, otp: string): Observable<{ success: boolean; message: string; token?: string }> {
    return this.http.post<{ success: boolean; message: string; token?: string }>(`${this.apiUrl}/auth/verify-otp`, { email, otp });
  }

  socialLogin(provider: string, token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/social-login`, { provider, token });
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh-token`, { refreshToken });
  }

  logout(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/auth/logout`, {});
  }

  enable2FA(): Observable<{ success: boolean; message: string; secret?: string; qrCodeUrl?: string }> {
    return this.http.post<{ success: boolean; message: string; secret?: string; qrCodeUrl?: string }>(`${this.apiUrl}/auth/enable-2fa`, {});
  }

  verify2FA(code: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/auth/verify-2fa`, { code });
  }

  disable2FA(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/auth/disable-2fa`, {});
  }

  resetPassword(data: { email: string; otp: string; newPassword: string }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/auth/reset-password`, data);
  }

  verifyEmail(token: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/auth/verify-email`, { token });
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/auth/change-password`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`);
  }

  updateProfile(profileData: any): Observable<{ success: boolean; message: string; user?: any }> {
    return this.http.put<{ success: boolean; message: string; user?: any }>(`${this.apiUrl}/auth/profile`, profileData);
  }

  uploadProfilePicture(file: File): Observable<{ success: boolean; message: string; url?: string }> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return this.http.post<{ success: boolean; message: string; url?: string }>(`${this.apiUrl}/auth/upload-profile-picture`, formData);
  }

  uploadCoverPhoto(file: File): Observable<{ success: boolean; message: string; url?: string }> {
    const formData = new FormData();
    formData.append('coverPhoto', file);
    return this.http.post<{ success: boolean; message: string; url?: string }>(`${this.apiUrl}/auth/upload-cover-photo`, formData);
  }

  getLoginHistory(page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/auth/login-history`, { params });
  }

  // Legacy methods for backward compatibility
  forgotPassword(email: string): Observable<any> {
    return this.generateOtp(email);
  }

  otpVerification(email: string, otp: string): Observable<any> {
    return this.verifyOtp(email, otp);
  }
}