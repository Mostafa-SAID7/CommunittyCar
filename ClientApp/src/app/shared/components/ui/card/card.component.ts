import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card {
      @apply rounded-lg border bg-card text-card-foreground shadow-sm;
    }
  `]
})
export class CardComponent {
  @Input() class: string = '';

  get cardClasses(): string {
    return `card ${this.class}`.trim();
  }
}