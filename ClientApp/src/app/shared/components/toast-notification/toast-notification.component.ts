import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification, NotificationType } from '../../../core/models/notification.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="toast-notification"
      [ngClass]="getToastClasses()"
      [@slideInOut]
      (click)="onClick()"
    >
      <div class="toast-icon">
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

      <div class="toast-content">
        <div class="toast-title">{{ notification.title }}</div>
        <div class="toast-message">{{ notification.message }}</div>
      </div>

      <button
        class="toast-close"
        (click)="onClose($event)"
        aria-label="Close notification"
      >
        <svg class="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="toast-progress" [style.width.%]="progressWidth"></div>
    </div>
  `,
  styles: [`
    .toast-notification {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      border-left: 4px solid;
      min-width: 320px;
      max-width: 480px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .toast-notification:hover {
      transform: translateY(-1px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .toast-notification.success {
      border-left-color: #10b981;
    }

    .toast-notification.error {
      border-left-color: #ef4444;
    }

    .toast-notification.warning {
      border-left-color: #f59e0b;
    }

    .toast-notification.info {
      border-left-color: #3b82f6;
    }

    .toast-icon {
      flex-shrink: 0;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
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

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-weight: 600;
      font-size: 0.875rem;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }

    .toast-message {
      font-size: 0.75rem;
      color: #6b7280;
      line-height: 1.4;
    }

    .toast-close {
      flex-shrink: 0;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      border-radius: 0.25rem;
      transition: all 0.2s ease;
    }

    .toast-close:hover {
      background: #f3f4f6;
      color: #6b7280;
    }

    .close-icon {
      width: 1rem;
      height: 1rem;
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: currentColor;
      transition: width 0.1s linear;
    }

    .toast-notification.success .toast-progress {
      background: #10b981;
    }

    .toast-notification.error .toast-progress {
      background: #ef4444;
    }

    .toast-notification.warning .toast-progress {
      background: #f59e0b;
    }

    .toast-notification.info .toast-progress {
      background: #3b82f6;
    }
  `],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  @Input() notification!: Notification;
  @Input() duration: number = 5000; // 5 seconds default
  @Output() closed = new EventEmitter<string>();
  @Output() clicked = new EventEmitter<Notification>();

  progressWidth: number = 100;
  private intervalId: any;
  private timeoutId: any;

  ngOnInit(): void {
    this.startAutoClose();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.close();
  }

  onClick(): void {
    this.clicked.emit(this.notification);
    this.close();
  }

  private startAutoClose(): void {
    const startTime = Date.now();
    const endTime = startTime + this.duration;

    this.intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      this.progressWidth = (remaining / this.duration) * 100;

      if (remaining <= 0) {
        this.close();
      }
    }, 50);

    this.timeoutId = setTimeout(() => {
      this.close();
    }, this.duration);
  }

  private close(): void {
    this.clearTimers();
    this.closed.emit(this.notification.id);
  }

  private clearTimers(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private getToastClasses(): { [key: string]: boolean } {
    return {
      [this.notification.type]: true
    };
  }
}