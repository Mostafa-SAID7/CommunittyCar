import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/Profile/me`);
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/Profile/${userId}`);
  }

  createProfile(profile: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/Profile`, profile);
  }

  updateProfile(profile: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/Profile`, profile);
  }

  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Profile`);
  }

  uploadProfilePicture(file: File): Observable<{ profilePictureUrl: string }> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return this.http.post<{ profilePictureUrl: string }>(`${this.apiUrl}/Profile/profile-picture`, formData);
  }

  deleteProfilePicture(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Profile/profile-picture`);
  }

  uploadCoverPhoto(file: File): Observable<{ coverPhotoUrl: string }> {
    const formData = new FormData();
    formData.append('coverPhoto', file);
    return this.http.post<{ coverPhotoUrl: string }>(`${this.apiUrl}/Profile/cover-photo`, formData);
  }

  deleteCoverPhoto(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Profile/cover-photo`);
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