import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 [class]="titleClasses">
      <ng-content></ng-content>
    </h3>
  `,
  styles: [`
    .card-title {
      @apply text-2xl font-semibold leading-none tracking-tight;
    }
  `]
})
export class CardTitleComponent {
  @Input() class: string = '';

  get titleClasses(): string {
    return `card-title ${this.class}`.trim();
  }
}