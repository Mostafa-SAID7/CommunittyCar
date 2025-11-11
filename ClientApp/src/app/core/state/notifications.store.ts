import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, tap } from 'rxjs';
import { Notification } from '../models/notification.model';
import { NotificationService } from '../services/notification.service';

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class NotificationsStore extends ComponentStore<NotificationsState> {
  private notificationService = inject(NotificationService);

  constructor() {
    super(initialState);
  }

  // Selectors
  readonly notifications$ = this.select(state => state.notifications);
  readonly unreadCount$ = this.select(state => state.unreadCount);
  readonly loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);

  // Effects
  readonly loadNotifications = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      this.notificationService.getNotifications(),
      tap({
        next: (response) => {
          if (response.success && response.data) {
            this.patchState({
              notifications: response.data,
              unreadCount: response.data.filter(n => !n.isRead).length,
              loading: false
            });
          }
        },
        error: (error) => {
          this.patchState({ error: error.message, loading: false });
        }
      })
    )
  );

  readonly markAsRead = this.effect<string>(notificationId$ =>
    notificationId$.pipe(
      this.notificationService.markAsRead(notificationId$),
      tap({
        next: () => {
          this.updateNotificationReadStatus(notificationId$, true);
        },
        error: (error) => {
          this.patchState({ error: error.message });
        }
      })
    )
  );

  readonly markAllAsRead = this.effect<void>(trigger$ =>
    trigger$.pipe(
      this.notificationService.markAllAsRead(),
      tap({
        next: () => {
          this.markAllNotificationsAsRead();
        },
        error: (error) => {
          this.patchState({ error: error.message });
        }
      })
    )
  );

  readonly addNotification = this.effect<Notification>(notification$ =>
    notification$.pipe(
      tap(notification => {
        this.addNotificationToState(notification);
      })
    )
  );

  // Updaters
  private readonly updateNotificationReadStatus = this.updater(
    (state, notificationId: string, isRead: boolean) => {
      const notifications = state.notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead }
          : notification
      );
      const unreadCount = notifications.filter(n => !n.isRead).length;
      return { ...state, notifications, unreadCount };
    }
  );

  private readonly markAllNotificationsAsRead = this.updater(state => {
    const notifications = state.notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    return { ...state, notifications, unreadCount: 0 };
  });

  private readonly addNotificationToState = this.updater((state, notification: Notification) => {
    const notifications = [notification, ...state.notifications];
    const unreadCount = notifications.filter(n => !n.isRead).length;
    return { ...state, notifications, unreadCount };
  });

  // Methods
  getUnreadCount(): number {
    return this.get().unreadCount;
  }

  getNotifications(): Notification[] {
    return this.get().notifications;
  }
}