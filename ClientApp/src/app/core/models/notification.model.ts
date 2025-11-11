export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  data?: any;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  BOOKING_CONFIRMED = 'booking_confirmed',
  PAYMENT_RECEIVED = 'payment_received',
  CAR_RETURNED = 'car_returned',
  NEW_MESSAGE = 'new_message'
}

export interface NotificationCreateRequest {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: any;
}

export interface NotificationUpdateRequest {
  isRead: boolean;
}