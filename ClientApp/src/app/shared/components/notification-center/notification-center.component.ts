import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
        animate('300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)')
      ]),
      transition('* => void', [
        animate('300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('notificationItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(-20px)' }))
      ])
    ])
  ]
})
export class NotificationCenterComponent implements OnInit, OnDestroy {
  @Input() position: 'left' | 'right' = 'right';
  @Input() width: string = '380px';
  @Input() maxHeight: string = '80vh';
  @Input() showCategories: boolean = true;
  @Input() enableSound: boolean = true;

  notifications: Notification[] = [];
  unreadCount: number = 0;
  isOpen: boolean = false;
  selectedCategory: string = 'all';
  searchTerm: string = '';
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
      // Play sound if enabled
      if (this.enableSound) {
        this.playNotificationSound();
      }
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

  clearCategoryNotifications(category: string): void {
    this.notificationService.clearNotificationsByCategory(category);
  }

  onNotificationAction(notification: Notification): void {
    if (notification.action) {
      notification.action.callback();
      this.removeNotification(notification.id);
    }
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  get filteredNotifications(): Notification[] {
    let filtered = this.notifications;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(n => n.category === this.selectedCategory);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(n =>
        n.title?.toLowerCase().includes(term) ||
        n.message.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  get categories(): string[] {
    const cats = new Set(this.notifications.map(n => n.category).filter((cat): cat is string => Boolean(cat)));
    return Array.from(cats);
  }

  get unreadCountByCategory(): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    this.notifications.forEach(n => {
      if (!n.read && n.category) {
        counts[n.category] = (counts[n.category] || 0) + 1;
      }
    });
    return counts;
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

  getPriorityClass(priority?: string): string {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }

  private playNotificationSound(): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn('Notification sound not supported');
    }
  }
}