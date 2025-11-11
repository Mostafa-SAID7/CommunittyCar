import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

@Pipe({
  name: 'translate',
  pure: false // Make it impure to update when language changes
})
export class TranslatePipe implements PipeTransform {
  private i18nService = inject(I18nService);

  transform(key: string, params?: Record<string, string>): string {
    return this.i18nService.translate(key, params);
  }
}