import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('void => *', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in')
      ]),
      transition('* => void', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class NotificationCenterComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  isOpen: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
        this.updateUnreadCount();
      })
    );

    this.subscriptions.add(
      this.notificationService.getUnreadCount().subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleNotificationCenter(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      // Mark all as read when opening
      this.notificationService.markAllAsRead();
    }
  }

  closeNotificationCenter(): void {
    this.isOpen = false;
  }

  removeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }

  clearAllNotifications(): void {
    this.notificationService.clearAllNotifications();
  }

  onNotificationAction(notification: Notification): void {
    if (notification.action) {
      notification.action.callback();
      this.removeNotification(notification.id);
    }
  }

  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-success';
      case 'error':
        return 'fas fa-exclamation-circle text-error';
      case 'warning':
        return 'fas fa-exclamation-triangle text-warning';
      case 'info':
        return 'fas fa-info-circle text-info';
      default:
        return 'fas fa-bell text-info';
    }
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }
}