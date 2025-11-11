import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="contentClasses">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card-content {
      @apply p-6 pt-0;
    }
  `]
})
export class CardContentComponent {
  @Input() class: string = '';

  get contentClasses(): string {
    return `card-content ${this.class}`.trim();
  }
}