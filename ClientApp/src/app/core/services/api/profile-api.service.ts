import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileApiService {
  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<User> {
    return this.http.get<User>('/api/profile/me');
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`/api/profile/${userId}`);
  }

  createProfile(profile: Partial<User>): Observable<User> {
    return this.http.post<User>('/api/profile', profile);
  }

  updateProfile(profile: Partial<User>): Observable<User> {
    return this.http.put<User>('/api/profile', profile);
  }

  deleteProfile(): Observable<any> {
    return this.http.delete('/api/profile');
  }

  uploadProfilePicture(file: File): Observable<{ profilePictureUrl: string }> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return this.http.post<{ profilePictureUrl: string }>('/api/profile/profile-picture', formData);
  }

  deleteProfilePicture(): Observable<any> {
    return this.http.delete('/api/profile/profile-picture');
  }

  uploadCoverPhoto(file: File): Observable<{ coverPhotoUrl: string }> {
    const formData = new FormData();
    formData.append('coverPhoto', file);
    return this.http.post<{ coverPhotoUrl: string }>('/api/profile/cover-photo', formData);
  }

  deleteCoverPhoto(): Observable<any> {
    return this.http.delete('/api/profile/cover-photo');
  }

  // Legacy methods for backward compatibility
  getProfile(): Observable<User> {
    return this.getMyProfile();
  }

  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    return this.uploadProfilePicture(file).pipe(
      // Transform response to match legacy format
      map(response => ({ avatarUrl: response.profilePictureUrl }))
    );
  }
}

// Import map operator for legacy method
import { map } from 'rxjs/operators';