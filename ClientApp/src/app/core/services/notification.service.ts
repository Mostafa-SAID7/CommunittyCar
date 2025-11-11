import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Notification, NotificationCreateRequest, NotificationUpdateRequest } from '../models/notification.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/api/notifications`;
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private unreadCount$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    return this.http.get<ApiResponse<Notification[]>>(this.apiUrl).pipe(
      map(response => response.data || []),
      tap(notifications => {
        this.notifications$.next(notifications);
        this.updateUnreadCount(notifications);
      })
    );
  }

  getNotification(id: string): Observable<Notification> {
    return this.http.get<ApiResponse<Notification>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data!),
      tap(notification => {
        this.updateNotificationInList(notification);
      })
    );
  }

  createNotification(notification: NotificationCreateRequest): Observable<Notification> {
    return this.http.post<ApiResponse<Notification>>(this.apiUrl, notification).pipe(
      map(response => response.data!),
      tap(notification => {
        this.addNotificationToList(notification);
      })
    );
  }

  markAsRead(id: string): Observable<any> {
    const updateRequest: NotificationUpdateRequest = { isRead: true };
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}/read`, updateRequest).pipe(
      tap(response => {
        if (response.success) {
          this.markNotificationAsRead(id);
        }
      })
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/mark-all-read`, {}).pipe(
      tap(response => {
        if (response.success) {
          this.markAllNotificationsAsRead();
        }
      })
    );
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      tap(response => {
        if (response.success) {
          this.removeNotificationFromList(id);
        }
      })
    );
  }

  // Local state management
  getNotificationsObservable(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  getUnreadCountObservable(): Observable<number> {
    return this.unreadCount$.asObservable();
  }

  getCurrentNotifications(): Notification[] {
    return this.notifications$.value;
  }

  getUnreadCountValue(): number {
    return this.unreadCount$.value;
  }

  // Real-time updates from SignalR
  addRealTimeNotification(notification: Notification): void {
    this.addNotificationToList(notification);
  }

  private addNotificationToList(notification: Notification): void {
    const currentNotifications = this.notifications$.value;
    const updatedNotifications = [notification, ...currentNotifications];
    this.notifications$.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
  }

  private updateNotificationInList(notification: Notification): void {
    const currentNotifications = this.notifications$.value;
    const index = currentNotifications.findIndex(n => n.id === notification.id);
    if (index !== -1) {
      currentNotifications[index] = notification;
      this.notifications$.next([...currentNotifications]);
      this.updateUnreadCount(currentNotifications);
    }
  }

  private markNotificationAsRead(id: string): void {
    const currentNotifications = this.notifications$.value;
    const notification = currentNotifications.find(n => n.id === id);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      this.notifications$.next([...currentNotifications]);
      this.updateUnreadCount(currentNotifications);
    }
  }

  private markAllNotificationsAsRead(): void {
    const currentNotifications = this.notifications$.value;
    const updatedNotifications = currentNotifications.map(n => ({ ...n, isRead: true }));
    this.notifications$.next(updatedNotifications);
    this.unreadCount$.next(0);
  }

  private removeNotificationFromList(id: string): void {
    const currentNotifications = this.notifications$.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications$.next(filteredNotifications);
    this.updateUnreadCount(filteredNotifications);
  }

  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    this.unreadCount$.next(unreadCount);
  }
}