import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalConfig {
  id: string;
  component?: any;
  data?: any;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  backdrop?: 'static' | 'dynamic';
  closable?: boolean;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  customClass?: string;
}

export interface ToastConfig {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  action?: {
    label: string;
    callback: () => void;
  };
  persistent?: boolean;
}

export interface DrawerConfig {
  id: string;
  component?: any;
  data?: any;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: string;
  backdrop?: boolean;
  closable?: boolean;
  title?: string;
  showHeader?: boolean;
  customClass?: string;
}

export interface SheetConfig {
  id: string;
  component?: any;
  data?: any;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: string;
  backdrop?: boolean;
  closable?: boolean;
  snapPoints?: string[];
  customClass?: string;
}

export interface DialogConfig {
  id: string;
  type: 'alert' | 'confirm' | 'prompt';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  inputType?: 'text' | 'email' | 'password' | 'number';
  inputPlaceholder?: string;
  inputValue?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // Modal management
  private modalsSubject = new BehaviorSubject<ModalConfig[]>([]);
  public modals$ = this.modalsSubject.asObservable();

  // Toast management
  private toastsSubject = new BehaviorSubject<ToastConfig[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  // Drawer management
  private drawersSubject = new BehaviorSubject<DrawerConfig[]>([]);
  public drawers$ = this.drawersSubject.asObservable();

  // Sheet management
  private sheetsSubject = new BehaviorSubject<SheetConfig[]>([]);
  public sheets$ = this.sheetsSubject.asObservable();

  // Dialog management
  private dialogsSubject = new BehaviorSubject<DialogConfig[]>([]);
  public dialogs$ = this.dialogsSubject.asObservable();

  // Loading states
  private loadingStates = new Map<string, BehaviorSubject<boolean>>();
  private globalLoadingSubject = new BehaviorSubject<boolean>(false);
  public globalLoading$ = this.globalLoadingSubject.asObservable();

  // Theme management
  private themeSubject = new BehaviorSubject<'light' | 'dark' | 'auto'>('auto');
  public theme$ = this.themeSubject.asObservable();

  // Sidebar/Drawer states
  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  public sidebarOpen$ = this.sidebarOpenSubject.asObservable();

  // Mobile menu states
  private mobileMenuOpenSubject = new BehaviorSubject<boolean>(false);
  public mobileMenuOpen$ = this.mobileMenuOpenSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  // Modal methods
  openModal(config: Omit<ModalConfig, 'id'>): string {
    const id = this.generateId();
    const modalConfig: ModalConfig = {
      id,
      size: 'md',
      backdrop: 'dynamic',
      closable: true,
      showHeader: true,
      showFooter: false,
      ...config
    };

    const currentModals = this.modalsSubject.value;
    this.modalsSubject.next([...currentModals, modalConfig]);

    return id;
  }

  closeModal(id: string): void {
    const currentModals = this.modalsSubject.value;
    this.modalsSubject.next(currentModals.filter(modal => modal.id !== id));
  }

  closeAllModals(): void {
    this.modalsSubject.next([]);
  }

  getModal(id: string): ModalConfig | undefined {
    return this.modalsSubject.value.find(modal => modal.id === id);
  }

  updateModal(id: string, updates: Partial<ModalConfig>): void {
    const currentModals = this.modalsSubject.value;
    const updatedModals = currentModals.map(modal =>
      modal.id === id ? { ...modal, ...updates } : modal
    );
    this.modalsSubject.next(updatedModals);
  }

  // Toast methods
  showToast(config: Omit<ToastConfig, 'id'>): string {
    const id = this.generateId();
    const toastConfig: ToastConfig = {
      id,
      duration: 3000,
      position: 'top-right',
      persistent: false,
      ...config
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toastConfig]);

    // Auto remove after duration
    if (toastConfig.duration && !toastConfig.persistent) {
      setTimeout(() => {
        this.removeToast(id);
      }, toastConfig.duration);
    }

    return id;
  }

  removeToast(id: string): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  clearAllToasts(): void {
    this.toastsSubject.next([]);
  }

  // Convenience methods for different toast types
  showSuccessToast(message: string, title?: string, duration?: number): string {
    return this.showToast({
      type: 'success',
      message,
      title,
      duration
    });
  }

  showErrorToast(message: string, title?: string, duration?: number): string {
    return this.showToast({
      type: 'error',
      message,
      title,
      duration: duration || 5000
    });
  }

  showWarningToast(message: string, title?: string, duration?: number): string {
    return this.showToast({
      type: 'warning',
      message,
      title,
      duration
    });
  }

  showInfoToast(message: string, title?: string, duration?: number): string {
    return this.showToast({
      type: 'info',
      message,
      title,
      duration
    });
  }

  // Drawer methods
  openDrawer(config: Omit<DrawerConfig, 'id'>): string {
    const id = this.generateId();
    const drawerConfig: DrawerConfig = {
      id,
      position: 'right',
      size: '400px',
      backdrop: true,
      closable: true,
      showHeader: true,
      ...config
    };

    const currentDrawers = this.drawersSubject.value;
    this.drawersSubject.next([...currentDrawers, drawerConfig]);

    return id;
  }

  closeDrawer(id: string): void {
    const currentDrawers = this.drawersSubject.value;
    this.drawersSubject.next(currentDrawers.filter(drawer => drawer.id !== id));
  }

  closeAllDrawers(): void {
    this.drawersSubject.next([]);
  }

  // Sheet methods
  openSheet(config: Omit<SheetConfig, 'id'>): string {
    const id = this.generateId();
    const sheetConfig: SheetConfig = {
      id,
      position: 'bottom',
      size: '50vh',
      backdrop: true,
      closable: true,
      snapPoints: ['50vh', '100vh'],
      ...config
    };

    const currentSheets = this.sheetsSubject.value;
    this.sheetsSubject.next([...currentSheets, sheetConfig]);

    return id;
  }

  closeSheet(id: string): void {
    const currentSheets = this.sheetsSubject.value;
    this.sheetsSubject.next(currentSheets.filter(sheet => sheet.id !== id));
  }

  closeAllSheets(): void {
    this.sheetsSubject.next([]);
  }

  // Dialog methods
  showDialog(config: Omit<DialogConfig, 'id'>): Observable<any> {
    return new Observable(observer => {
      const id = this.generateId();
      const dialogConfig: DialogConfig = {
        id,
        type: 'alert',
        confirmText: 'OK',
        cancelText: 'Cancel',
        ...config
      };

      const currentDialogs = this.dialogsSubject.value;
      this.dialogsSubject.next([...currentDialogs, dialogConfig]);

      // Listen for dialog result
      const subscription = this.dialogs$.subscribe(dialogs => {
        const dialog = dialogs.find(d => d.id === id);
        if (!dialog) {
          // Dialog was closed
          observer.complete();
          subscription.unsubscribe();
        }
      });
    });
  }

  closeDialog(id: string, result?: any): void {
    const currentDialogs = this.dialogsSubject.value;
    this.dialogsSubject.next(currentDialogs.filter(dialog => dialog.id !== id));
  }

  // Convenience dialog methods
  alert(title: string, message: string): Observable<void> {
    return this.showDialog({
      type: 'alert',
      title,
      message
    });
  }

  confirm(title: string, message: string, confirmText?: string, cancelText?: string): Observable<boolean> {
    return new Observable(observer => {
      this.showDialog({
        type: 'confirm',
        title,
        message,
        confirmText,
        cancelText
      }).subscribe(result => {
        observer.next(result === true);
        observer.complete();
      });
    });
  }

  prompt(title: string, message: string, placeholder?: string, value?: string): Observable<string | null> {
    return new Observable(observer => {
      this.showDialog({
        type: 'prompt',
        title,
        message,
        inputPlaceholder: placeholder,
        inputValue: value
      }).subscribe(result => {
        observer.next(result);
        observer.complete();
      });
    });
  }

  // Loading state management
  setLoading(key: string, loading: boolean): void {
    if (!this.loadingStates.has(key)) {
      this.loadingStates.set(key, new BehaviorSubject<boolean>(false));
    }
    this.loadingStates.get(key)!.next(loading);

    // Update global loading state
    const anyLoading = Array.from(this.loadingStates.values()).some(subject => subject.value);
    this.globalLoadingSubject.next(anyLoading);
  }

  getLoading(key: string): Observable<boolean> {
    if (!this.loadingStates.has(key)) {
      this.loadingStates.set(key, new BehaviorSubject<boolean>(false));
    }
    return this.loadingStates.get(key)!.asObservable();
  }

  isLoading(key: string): boolean {
    return this.loadingStates.get(key)?.value || false;
  }

  // Theme management
  setTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem('ui-theme', theme);
  }

  getTheme(): 'light' | 'dark' | 'auto' {
    return this.themeSubject.value;
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('ui-theme') as 'light' | 'dark' | 'auto' | null;
    const theme = savedTheme || 'auto';
    this.setTheme(theme);
  }

  private applyTheme(theme: 'light' | 'dark' | 'auto'): void {
    const root = document.documentElement;
    const actualTheme = theme === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    root.setAttribute('data-theme', actualTheme);
    root.classList.toggle('dark', actualTheme === 'dark');
  }

  // Sidebar management
  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  setSidebarOpen(open: boolean): void {
    this.sidebarOpenSubject.next(open);
  }

  // Mobile menu management
  toggleMobileMenu(): void {
    this.mobileMenuOpenSubject.next(!this.mobileMenuOpenSubject.value);
  }

  setMobileMenuOpen(open: boolean): void {
    this.mobileMenuOpenSubject.next(open);
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Scroll management
  scrollToTop(smooth: boolean = true): void {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  scrollToElement(selector: string, smooth: boolean = true): void {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }

  // Focus management
  focusElement(selector: string): void {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  }

  // Clipboard utilities
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  }

  // Screen size utilities
  getScreenSize(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  isTablet(): boolean {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }

  isDesktop(): boolean {
    return window.innerWidth >= 1024;
  }

  // Breakpoint observables
  onBreakpointChange(): Observable<'mobile' | 'tablet' | 'desktop'> {
    return new Observable(observer => {
      const checkBreakpoint = () => {
        if (this.isMobile()) {
          observer.next('mobile');
        } else if (this.isTablet()) {
          observer.next('tablet');
        } else {
          observer.next('desktop');
        }
      };

      checkBreakpoint();
      window.addEventListener('resize', checkBreakpoint);

      return () => {
        window.removeEventListener('resize', checkBreakpoint);
      };
    });
  }

  // Local storage helpers
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clearStorage(): void {
    localStorage.clear();
  }

  // Session storage helpers
  setSessionItem(key: string, value: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to sessionStorage:', error);
    }
  }

  getSessionItem<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to read from sessionStorage:', error);
      return null;
    }
  }

  removeSessionItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearSessionStorage(): void {
    sessionStorage.clear();
  }
}