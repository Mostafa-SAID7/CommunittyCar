import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() dismissible: boolean = true;
  @Input() showIcon: boolean = true;
  @Input() autoClose: boolean = false;
  @Input() autoCloseDelay: number = 5000;

  @Output() dismissed = new EventEmitter<void>();
  @Output() actionClicked = new EventEmitter<string>();

  isVisible: boolean = true;

  ngOnInit(): void {
    if (this.autoClose && this.autoCloseDelay > 0) {
      setTimeout(() => {
        this.dismiss();
      }, this.autoCloseDelay);
    }
  }

  dismiss(): void {
    this.isVisible = false;
    this.dismissed.emit();
  }

  onActionClick(action: string): void {
    this.actionClicked.emit(action);
  }

  getIconClass(): string {
    switch (this.type) {
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

  getAlertClass(): string {
    const baseClasses = 'alert';
    const typeClass = `alert-${this.type}`;
    return `${baseClasses} ${typeClass}`;
  }
}
