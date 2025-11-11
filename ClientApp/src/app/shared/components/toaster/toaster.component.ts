import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, ToasterNotification } from '../../../core/services/notification.service';
import { toastAnimation, progressAnimation } from '../../../core/utilities/animations';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.component.html',

  animations: [
    toastAnimation,
    progressAnimation
  ]
})
export class ToasterComponent implements OnInit, OnDestroy {
  @Input() maxToasts: number = 3;
  @Input() defaultPosition: ToasterNotification['position'] = 'top-right';

  currentNotifications: ToasterNotification[] = [];
  private subscription: Subscription = new Subscription();
  private toastQueue: ToasterNotification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.toaster$.subscribe(notification => {
      if (notification) {
        this.addToQueue(notification);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private addToQueue(notification: ToasterNotification): void {
    // Set default position if not provided
    if (!notification.position) {
      notification.position = this.defaultPosition;
    }

    // Add to queue
    this.toastQueue.push(notification);

    // Process queue
    this.processQueue();
  }

  private processQueue(): void {
    // Remove expired toasts
    this.currentNotifications = this.currentNotifications.filter(toast => {
      const isExpired = toast.timestamp && !toast.persistent &&
        toast.duration && (Date.now() - toast.timestamp.getTime()) > toast.duration;
      return !isExpired;
    });

    // Add new toasts if under limit
    while (this.currentNotifications.length < this.maxToasts && this.toastQueue.length > 0) {
      const notification = this.toastQueue.shift();
      if (notification) {
        this.currentNotifications.push(notification);
      }
    }
  }

  onClose(notification: ToasterNotification): void {
    this.currentNotifications = this.currentNotifications.filter(n => n !== notification);
    this.processQueue();
  }

  onAction(notification: ToasterNotification): void {
    if (notification.action) {
      notification.action.callback();
      this.onClose(notification);
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-bell';
    }
  }

  getPositionClass(position?: string): string {
    return `toaster-${position || this.defaultPosition}`;
  }

  getProgressState(notification: ToasterNotification): string {
    return notification.duration && !notification.persistent ? 'start' : 'end';
  }

  trackByNotificationId(index: number, notification: ToasterNotification): string {
    return notification.id;
  }

  hasNotificationsForPosition(position: string): boolean {
    return this.currentNotifications.some(n => n.position === position || (!n.position && position === 'top-right'));
  }

  getNotificationsForPosition(position: string): ToasterNotification[] {
    if (position === 'top-right') {
      return this.currentNotifications.filter(n => n.position === position || !n.position).slice(0, this.maxToasts);
    }
    return this.currentNotifications.filter(n => n.position === position).slice(0, this.maxToasts);
  }
}
