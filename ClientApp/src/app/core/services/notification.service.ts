import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  public notification$ = this.notificationSubject.asObservable();

  showSuccess(message: string, duration: number = 3000): void {
    this.showNotification({ type: 'success', message, duration });
  }

  showError(message: string, duration: number = 5000): void {
    this.showNotification({ type: 'error', message, duration });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.showNotification({ type: 'info', message, duration });
  }

  showWarning(message: string, duration: number = 4000): void {
    this.showNotification({ type: 'warning', message, duration });
  }

  private showNotification(notification: Notification): void {
    this.notificationSubject.next(notification);
    if (notification.duration) {
      setTimeout(() => {
        this.notificationSubject.next(null);
      }, notification.duration);
    }
  }

  clear(): void {
    this.notificationSubject.next(null);
  }
}