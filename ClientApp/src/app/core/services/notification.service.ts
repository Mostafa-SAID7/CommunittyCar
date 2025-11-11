import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { filter, take } from 'rxjs/operators';

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
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  data?: any;
}

export interface NotificationAction {
  label: string;
  callback: () => void;
  primary?: boolean;
}

export interface ToasterNotification extends Notification {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export interface NotificationSettings {
  enableSound: boolean;
  enableVibration: boolean;
  showInNotificationCenter: boolean;
  autoHideToasters: boolean;
  maxNotifications: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private toasterSubject = new BehaviorSubject<ToasterNotification | null>(null);
  private settings: NotificationSettings = {
    enableSound: true,
    enableVibration: false,
    showInNotificationCenter: true,
    autoHideToasters: true,
    maxNotifications: 50
  };

  public notifications$ = this.notificationsSubject.asObservable();
  public toaster$ = this.toasterSubject.asObservable();

  // Toaster methods
  showSuccess(message: string, title?: string, duration: number = 3000, position?: ToasterNotification['position']): void {
    this.showToaster({
      type: 'success',
      message,
      title,
      duration,
      position: position || 'top-right',
      id: this.generateId(),
      timestamp: new Date()
    });
  }

  showError(message: string, title?: string, duration: number = 5000, position?: ToasterNotification['position']): void {
    this.showToaster({
      type: 'error',
      message,
      title,
      duration,
      position: position || 'top-right',
      id: this.generateId(),
      timestamp: new Date()
    });
  }

  showInfo(message: string, title?: string, duration: number = 3000, position?: ToasterNotification['position']): void {
    this.showToaster({
      type: 'info',
      message,
      title,
      duration,
      position: position || 'top-right',
      id: this.generateId(),
      timestamp: new Date()
    });
  }

  showWarning(message: string, title?: string, duration: number = 4000, position?: ToasterNotification['position']): void {
    this.showToaster({
      type: 'warning',
      message,
      title,
      duration,
      position: position || 'top-right',
      id: this.generateId(),
      timestamp: new Date()
    });
  }

  showToaster(notification: ToasterNotification): void {
    this.toasterSubject.next(notification);
    if (notification.duration && !notification.persistent && this.settings.autoHideToasters) {
      timer(notification.duration).pipe(take(1)).subscribe(() => {
        this.clearToaster();
      });
    }
    this.playNotificationSound(notification.type);
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
      read: false,
      priority: notification.priority || 'medium'
    };

    const currentNotifications = this.notificationsSubject.value;

    // Limit notifications to max setting
    let updatedNotifications = [newNotification, ...currentNotifications];
    if (updatedNotifications.length > this.settings.maxNotifications) {
      updatedNotifications = updatedNotifications.slice(0, this.settings.maxNotifications);
    }

    this.notificationsSubject.next(updatedNotifications);

    // Play sound for high priority notifications
    if (notification.priority === 'high' && this.settings.enableSound) {
      this.playNotificationSound('warning');
    }

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

  clearNotificationsByCategory(category: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(currentNotifications.filter(n => n.category !== category));
  }

  getNotificationsByCategory(category: string): Observable<Notification[]> {
    return this.notifications$.pipe(
      filter(notifications => notifications.some(n => n.category === category))
    );
  }

  getUnreadCount(): Observable<number> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        const unreadCount = notifications.filter(n => !n.read).length;
        observer.next(unreadCount);
      });
    });
  }

  getUnreadCountByCategory(category: string): Observable<number> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        const unreadCount = notifications.filter(n => !n.read && n.category === category).length;
        observer.next(unreadCount);
      });
    });
  }

  // Settings methods
  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private playNotificationSound(type: string): void {
    if (!this.settings.enableSound) return;

    // Create audio context for notification sounds
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different notification types
      const frequencies = {
        success: 800,
        error: 400,
        warning: 600,
        info: 500
      };

      oscillator.frequency.setValueAtTime(frequencies[type as keyof typeof frequencies] || 500, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Fallback for browsers that don't support Web Audio API
      console.warn('Notification sound not supported in this browser');
    }
  }

  // Bulk operations
  addMultipleNotifications(notifications: Omit<Notification, 'id' | 'timestamp'>[]): string[] {
    return notifications.map(notification => this.addNotification(notification));
  }

  removeMultipleNotifications(ids: string[]): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(currentNotifications.filter(n => !ids.includes(n.id)));
  }

  // Legacy methods for backward compatibility
  showNotification(notification: Notification): void {
    this.showToaster(notification as ToasterNotification);
  }

  clear(): void {
    this.clearToaster();
  }
}