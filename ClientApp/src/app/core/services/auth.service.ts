import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to get user info
      this.currentUserSubject.next(this.decodeToken(token));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/Auth/login', credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/Auth/register', userData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  socialLogin(provider: string, token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/Auth/social-login', { provider, token }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<AuthResponse>('/api/Auth/refresh-token', { refreshToken }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post('/api/Auth/logout', { refreshToken }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this.currentUserSubject.next(null);
      })
    );
  }

  enable2FA(): Observable<any> {
    return this.http.post('/api/Auth/enable-2fa', {});
  }

  disable2FA(): Observable<any> {
    return this.http.post('/api/Auth/disable-2fa', {});
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }

  is2FAEnabled(): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.is2FAEnabled ?? false : false;
  }

  isEmailVerified(): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.isEmailVerified ?? false : false;
  }

  private decodeToken(token: string): User {
    // Simple JWT decode (in real app, use a library like jwt-decode)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user;
  }
}