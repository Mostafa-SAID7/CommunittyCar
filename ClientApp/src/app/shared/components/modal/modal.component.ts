import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'small' | 'medium' | 'large' | 'extra-large';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() size: ModalSize = 'medium';
  @Input() closable: boolean = true;
  @Input() showCloseButton: boolean = true;
  @Input() backdropClosable: boolean = true;
  @Input() centered: boolean = true;

  @Output() closed = new EventEmitter<void>();
  @Output() opened = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.closable && this.isOpen) {
      this.close();
    }
  }

  open(): void {
    this.isOpen = true;
    this.opened.emit();
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();
    document.body.style.overflow = '';
  }

  onBackdropClick(): void {
    if (this.backdropClosable) {
      this.close();
    }
  }

  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  getModalClass(): string {
    const classes = ['modal'];

    if (this.centered) {
      classes.push('modal-centered');
    }

    return classes.join(' ');
  }

  getDialogClass(): string {
    const classes = ['modal-dialog'];

    switch (this.size) {
      case 'small':
        classes.push('modal-sm');
        break;
      case 'large':
        classes.push('modal-lg');
        break;
      case 'extra-large':
        classes.push('modal-xl');
        break;
      default:
        // medium is default
        break;
    }

    return classes.join(' ');
  }
}
