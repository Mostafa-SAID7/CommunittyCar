import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Notification } from '../../core/models/notification.model';
import { NotificationsStore } from '../../core/state/notifications.store';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, DateFormatPipe],
  template: `
    <div class="notifications-page">
      <div class="page-header">
        <h1 class="page-title">Notifications</h1>
        <button
          *ngIf="unreadCount > 0"
          class="mark-all-read-btn"
          (click)="markAllAsRead()"
          [disabled]="loading">
          Mark All as Read
        </button>
      </div>

      <div class="notifications-content">
        <div *ngIf="loading" class="loading-container">
          <app-loading-spinner></app-loading-spinner>
        </div>

        <div *ngIf="!loading && notifications.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 17h5l-5 5v-5z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </div>
          <h3>No notifications yet</h3>
          <p>You'll receive notifications about your bookings and account activity here.</p>
        </div>

        <div *ngIf="!loading && notifications.length > 0" class="notifications-list">
          <div
            *ngFor="let notification of notifications"
            class="notification-item"
            [ngClass]="{ 'unread': !notification.isRead }"
            (click)="markAsRead(notification.id)">
            <div class="notification-icon">
              <svg *ngIf="notification.type === 'success'" class="icon success" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <svg *ngIf="notification.type === 'error'" class="icon error" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <svg *ngIf="notification.type === 'warning'" class="icon warning" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <svg *ngIf="notification.type === 'info'" class="icon info" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>

            <div class="notification-content">
              <div class="notification-header">
                <h4 class="notification-title">{{ notification.title }}</h4>
                <span class="notification-time">{{ notification.createdAt | dateFormat }}</span>
              </div>
              <p class="notification-message">{{ notification.message }}</p>
              <div *ngIf="!notification.isRead" class="unread-indicator"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .mark-all-read-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .mark-all-read-btn:hover:not(:disabled) {
      background: #2563eb;
    }

    .mark-all-read-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 3rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .empty-icon {
      width: 4rem;
      height: 4rem;
      margin: 0 auto 1rem;
      opacity: 0.5;
    }

    .empty-icon svg {
      width: 100%;
      height: 100%;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.5rem;
    }

    .empty-state p {
      margin: 0;
      font-size: 0.875rem;
    }

    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .notification-item {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .notification-item:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border-color: #d1d5db;
    }

    .notification-item.unread {
      border-left: 4px solid #3b82f6;
      background: #eff6ff;
    }

    .notification-icon {
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #f3f4f6;
    }

    .icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    .icon.success {
      color: #10b981;
    }

    .icon.error {
      color: #ef4444;
    }

    .icon.warning {
      color: #f59e0b;
    }

    .icon.info {
      color: #3b82f6;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .notification-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .notification-time {
      font-size: 0.75rem;
      color: #6b7280;
      white-space: nowrap;
      margin-left: 1rem;
    }

    .notification-message {
      color: #4b5563;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }

    .unread-indicator {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 0.5rem;
      height: 0.5rem;
      background: #3b82f6;
      border-radius: 50%;
    }

    @media (max-width: 640px) {
      .notifications-page {
        padding: 1rem 0.5rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .notification-item {
        padding: 1rem;
      }

      .notification-header {
        flex-direction: column;
        gap: 0.25rem;
        align-items: flex-start;
      }

      .notification-time {
        margin-left: 0;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  notifications: Notification[] = [];
  unreadCount = 0;
  loading = false;

  constructor(private notificationsStore: NotificationsStore) {}

  ngOnInit(): void {
    // Subscribe to store state
    this.notificationsStore.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });

    this.notificationsStore.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });

    this.notificationsStore.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    // Load notifications
    this.notificationsStore.loadNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  markAsRead(notificationId: string): void {
    this.notificationsStore.markAsRead(notificationId);
  }

  markAllAsRead(): void {
    this.notificationsStore.markAllAsRead();
  }
}