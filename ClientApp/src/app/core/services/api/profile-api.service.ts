import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileApiService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<User>('/api/profile');
  }

  updateProfile(profile: Partial<User>): Observable<User> {
    return this.http.put<User>('/api/profile', profile);
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.post('/api/profile/change-password', data);
  }

  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ avatarUrl: string }>('/api/profile/avatar', formData);
  }
}