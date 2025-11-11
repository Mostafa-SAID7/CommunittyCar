import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="headerClasses">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card-header {
      @apply flex flex-col space-y-1.5 p-6;
    }
  `]
})
export class CardHeaderComponent {
  @Input() class: string = '';

  get headerClasses(): string {
    return `card-header ${this.class}`.trim();
  }
}