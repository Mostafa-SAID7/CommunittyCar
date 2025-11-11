import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [class]="descriptionClasses">
      <ng-content></ng-content>
    </p>
  `,
  styles: [`
    .card-description {
      @apply text-sm text-muted-foreground;
    }
  `]
})
export class CardDescriptionComponent {
  @Input() class: string = '';

  get descriptionClasses(): string {
    return `card-description ${this.class}`.trim();
  }
}