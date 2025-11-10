import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
  timestamp: Date;
  read?: boolean;
  action?: NotificationAction;
  persistent?: boolean;
}

export interface NotificationAction {
  label: string;
  callback: () => void;
}

export interface ToasterNotification extends Notification {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private toasterSubject = new BehaviorSubject<ToasterNotification | null>(null);

  public notifications$ = this.notificationsSubject.asObservable();
  public toaster$ = this.toasterSubject.asObservable();

  // Toaster methods
  showSuccess(message: string, title?: string, duration: number = 3000): void {
    this.showToaster({ type: 'success', message, title, duration, id: this.generateId(), timestamp: new Date() });
  }

  showError(message: string, title?: string, duration: number = 5000): void {
    this.showToaster({ type: 'error', message, title, duration, id: this.generateId(), timestamp: new Date() });
  }

  showInfo(message: string, title?: string, duration: number = 3000): void {
    this.showToaster({ type: 'info', message, title, duration, id: this.generateId(), timestamp: new Date() });
  }

  showWarning(message: string, title?: string, duration: number = 4000): void {
    this.showToaster({ type: 'warning', message, title, duration, id: this.generateId(), timestamp: new Date() });
  }

  showToaster(notification: ToasterNotification): void {
    this.toasterSubject.next(notification);
    if (notification.duration && !notification.persistent) {
      setTimeout(() => {
        this.clearToaster();
      }, notification.duration);
    }
  }

  clearToaster(): void {
    this.toasterSubject.next(null);
  }

  // Notification center methods
  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): string {
    const id = this.generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      read: false
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([newNotification, ...currentNotifications]);

    return id;
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(currentNotifications.filter(n => n.id !== id));
  }

  markAsRead(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updatedNotifications);
  }

  markAllAsRead(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updatedNotifications);
  }

  clearAllNotifications(): void {
    this.notificationsSubject.next([]);
  }

  getUnreadCount(): Observable<number> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        const unreadCount = notifications.filter(n => !n.read).length;
        observer.next(unreadCount);
      });
    });
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Legacy methods for backward compatibility
  showNotification(notification: Notification): void {
    this.showToaster(notification as ToasterNotification);
  }

  clear(): void {
    this.clearToaster();
  }
}