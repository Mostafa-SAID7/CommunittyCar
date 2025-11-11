import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { UiSignalStore } from '../state/ui.store';

export interface TranslationData {
  [key: string]: string | TranslationData;
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private translations: Map<string, TranslationData> = new Map();
  private currentLanguage$ = new BehaviorSubject<string>('en');
  private readonly defaultLanguage = 'en';

  constructor(
    private http: HttpClient,
    private uiStore: UiSignalStore
  ) {
    // Initialize with stored language or browser language
    const storedLanguage = this.uiStore.getCurrentLanguage();
    const initialLanguage = storedLanguage || this.detectBrowserLanguage();
    this.setLanguage(initialLanguage);
  }

  /**
   * Get current language as observable
   */
  getCurrentLanguage(): Observable<string> {
    return this.currentLanguage$.asObservable();
  }

  /**
   * Get current language value
   */
  getCurrentLanguageValue(): string {
    return this.currentLanguage$.value;
  }

  /**
   * Set current language
   */
  setLanguage(language: string): Observable<boolean> {
    if (this.translations.has(language)) {
      // Language already loaded
      this.currentLanguage$.next(language);
      this.uiStore.setLanguage(language);
      return of(true);
    }

    // Load language
    return this.loadLanguage(language).pipe(
      tap(success => {
        if (success) {
          this.currentLanguage$.next(language);
          this.uiStore.setLanguage(language);
        }
      })
    );
  }

  /**
   * Translate a key
   */
  translate(key: string, params?: Record<string, string>): string {
    const translation = this.getTranslation(key);
    if (!translation) {
      return key; // Return key if translation not found
    }

    // Replace parameters
    if (params) {
      return this.interpolate(translation, params);
    }

    return translation;
  }

  /**
   * Get translation for a key
   */
  private getTranslation(key: string): string {
    const currentLang = this.currentLanguage$.value;
    const translations = this.translations.get(currentLang);

    if (!translations) {
      return '';
    }

    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return '';
      }
    }

    return typeof value === 'string' ? value : '';
  }

  /**
   * Interpolate parameters in translation
   */
  private interpolate(text: string, params: Record<string, string>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] || match;
    });
  }

  /**
   * Load language translations
   */
  private loadLanguage(language: string): Observable<boolean> {
    const translationPath = `assets/i18n/${language}.json`;

    return this.http.get<TranslationData>(translationPath).pipe(
      map(data => {
        this.translations.set(language, data);
        return true;
      }),
      catchError(error => {
        console.warn(`Failed to load translations for language: ${language}`, error);
        // Try to load default language if current language fails
        if (language !== this.defaultLanguage) {
          return this.loadLanguage(this.defaultLanguage);
        }
        return of(false);
      })
    );
  }

  /**
   * Detect browser language
   */
  private detectBrowserLanguage(): string {
    const browserLang = navigator.language || 'en';
    // Return language code without region (e.g., 'en' from 'en-US')
    return browserLang.split('-')[0];
  }

  /**
   * Get available languages (this could be extended to load from config)
   */
  getAvailableLanguages(): string[] {
    return ['en', 'es', 'fr', 'de', 'ar']; // Example languages
  }

  /**
   * Check if language is loaded
   */
  isLanguageLoaded(language: string): boolean {
    return this.translations.has(language);
  }

  /**
   * Get all translations for current language
   */
  getTranslations(): TranslationData | undefined {
    return this.translations.get(this.currentLanguage$.value);
  }
}