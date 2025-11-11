import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { UiSignalStore } from '../../../core/state/ui.store';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="flex items-center space-x-2">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ 'common.language' | translate }}:
      </label>
      <select
        [value]="currentLanguage"
        (change)="switchLanguage($event)"
        class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option *ngFor="let lang of availableLanguages" [value]="lang">
          {{ getLanguageName(lang) }}
        </option>
      </select>
    </div>
  `,
  styles: []
})
export class LanguageSwitcherComponent {
  private i18nService = inject(I18nService);
  private uiStore = inject(UiSignalStore);

  currentLanguage = this.uiStore.getCurrentLanguage();
  availableLanguages = this.i18nService.getAvailableLanguages();

  switchLanguage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const language = target.value;
    this.i18nService.setLanguage(language).subscribe(success => {
      if (success) {
        this.currentLanguage = language;
        console.log(`Language switched to: ${language}`);
      }
    });
  }

  getLanguageName(lang: string): string {
    const names: Record<string, string> = {
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'ar': 'العربية'
    };
    return names[lang] || lang.toUpperCase();
  }
}