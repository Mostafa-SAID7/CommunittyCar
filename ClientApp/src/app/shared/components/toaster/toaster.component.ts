import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, ToasterNotification } from '../../../core/services/notification.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
  animations: [
    trigger('toastAnimation', [
      state('in', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('void => *', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in')
      ]),
      transition('* => void', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToasterComponent implements OnInit, OnDestroy {
  currentNotification: ToasterNotification | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.toaster$.subscribe(notification => {
      this.currentNotification = notification;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClose(): void {
    this.notificationService.clearToaster();
  }

  onAction(): void {
    if (this.currentNotification?.action) {
      this.currentNotification.action.callback();
      this.onClose();
    }
  }

  getIconClass(): string {
    if (!this.currentNotification) return '';

    switch (this.currentNotification.type) {
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

  getPositionClass(): string {
    const position = this.currentNotification?.position || 'top-right';
    return `toaster-${position}`;
  }
}