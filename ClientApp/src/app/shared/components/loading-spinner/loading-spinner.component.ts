import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',

})
export class LoadingSpinnerComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: string = '#667eea';
  @Input() message: string = '';
  @Input() overlay: boolean = false;
}
