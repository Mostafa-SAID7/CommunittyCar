import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Notification } from '../../../core/models/notification.model';
import { NotificationsStore } from '../../../core/state/notifications.store';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastNotificationComponent],
  template: `
    <div class="toast-container">
      <app-toast-notification
        *ngFor="let notification of visibleNotifications"
        [notification]="notification"
        [duration]="5000"
        (closed)="onNotificationClosed($event)"
        (clicked)="onNotificationClicked($event)"
        class="toast-item">
      </app-toast-notification>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 480px;
      pointer-events: none;
    }

    .toast-item {
      pointer-events: auto;
    }

    /* Mobile responsiveness */
    @media (max-width: 640px) {
      .toast-container {
        left: 1rem;
        right: 1rem;
        max-width: none;
      }
    }
  `]
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  visibleNotifications: Notification[] = [];
  private maxVisibleToasts = 3;

  constructor(private notificationsStore: NotificationsStore) {}

  ngOnInit(): void {
    // Listen for new notifications and show them as toasts
    this.notificationsStore.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        // Show only unread notifications as toasts
        const unreadNotifications = notifications.filter(n => !n.isRead);
        this.updateVisibleNotifications(unreadNotifications);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNotificationClosed(notificationId: string): void {
    this.removeNotification(notificationId);
    // Mark as read in the store
    this.notificationsStore.markAsRead(notificationId);
  }

  onNotificationClicked(notification: Notification): void {
    this.removeNotification(notification.id);
    // Mark as read and handle navigation if needed
    this.notificationsStore.markAsRead(notification.id);
    this.handleNotificationAction(notification);
  }

  private updateVisibleNotifications(notifications: Notification[]): void {
    // Show only the most recent notifications, limited by maxVisibleToasts
    const recentNotifications = notifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, this.maxVisibleToasts);

    this.visibleNotifications = recentNotifications;
  }

  private removeNotification(notificationId: string): void {
    this.visibleNotifications = this.visibleNotifications.filter(
      notification => notification.id !== notificationId
    );
  }

  private handleNotificationAction(notification: Notification): void {
    // Handle different notification types
    switch (notification.type) {
      case 'BOOKING_CONFIRMED':
        // Navigate to bookings page
        console.log('Navigate to bookings for notification:', notification.id);
        break;
      case 'PAYMENT_RECEIVED':
        // Navigate to payments/transactions page
        console.log('Navigate to payments for notification:', notification.id);
        break;
      case 'CAR_RETURNED':
        // Navigate to bookings history
        console.log('Navigate to booking history for notification:', notification.id);
        break;
      case 'NEW_MESSAGE':
        // Navigate to chat/messages
        console.log('Navigate to messages for notification:', notification.id);
        break;
      default:
        console.log('Handle notification:', notification);
    }
  }
}