import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="footerClasses">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card-footer {
      @apply flex items-center p-6 pt-0;
    }
  `]
})
export class CardFooterComponent {
  @Input() class: string = '';

  get footerClasses(): string {
    return `card-footer ${this.class}`.trim();
  }
}