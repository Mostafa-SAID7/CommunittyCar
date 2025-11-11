import { Injectable } from '@angular/core';
import { BaseSignalStore } from './base-signal-store';
import { UiState, initialUiState, ModalState, NotificationState, ThemeMode, ScreenSize } from '../../state/ui/ui.state';

/**
 * UI signal store for managing global UI state
 */
@Injectable({
  providedIn: 'root'
})
export class UiSignalStore extends BaseSignalStore<UiState> {
  constructor() {
    super(initialUiState);
  }

  /**
   * Reset UI state to initial values
   */
  reset(): void {
    this.setState(initialUiState);
  }

  // Theme Management
  /**
    * Set the current theme
    */
  setTheme(theme: ThemeMode): void {
    this.patchState({ theme });
  }

  /**
    * Get the effective theme (resolves 'system' to actual light/dark)
    */
  getEffectiveTheme(): 'light' | 'dark' {
    const state = this.getState();
    if (state.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return state.theme;
  }

  // Language Management
  /**
    * Set the current language
    */
  setLanguage(language: string): void {
    this.patchState({ language });
  }

  /**
    * Get the current language
    */
  getCurrentLanguage(): string {
    return this.getState().language;
  }

  /**
    * Detect the browser's language
    */
  detectBrowserLanguage(): string {
    return navigator.language || 'en';
  }

  // Loading Management
  /**
   * Start loading with optional message
   */
  startLoading(message?: string): void {
    this.updateState(currentState => ({
      ...currentState,
      loading: {
        isLoading: true,
        message: message || currentState.loading.message,
        count: currentState.loading.count + 1
      }
    }));
  }

  /**
   * Stop loading
   */
  stopLoading(): void {
    this.updateState(currentState => {
      const newCount = Math.max(0, currentState.loading.count - 1);
      return {
        ...currentState,
        loading: {
          isLoading: newCount > 0,
          message: newCount > 0 ? currentState.loading.message : undefined,
          count: newCount
        }
      };
    });
  }

  /**
   * Set loading message
   */
  setLoadingMessage(message: string): void {
    this.updateState(currentState => ({
      ...currentState,
      loading: {
        ...currentState.loading,
        message
      }
    }));
  }

  // Modal Management
  /**
   * Open a modal
   */
  openModal(modal: ModalState): void {
    this.updateState(currentState => ({
      ...currentState,
      modals: [...currentState.modals, modal]
    }));
  }

  /**
   * Close a modal by ID
   */
  closeModal(modalId: string): void {
    this.updateState(currentState => ({
      ...currentState,
      modals: currentState.modals.filter(modal => modal.id !== modalId)
    }));
  }

  /**
   * Close all modals
   */
  closeAllModals(): void {
    this.patchState({ modals: [] });
  }

  /**
   * Update modal data
   */
  updateModal(modalId: string, updates: Partial<ModalState>): void {
    this.updateState(currentState => ({
      ...currentState,
      modals: currentState.modals.map(modal =>
        modal.id === modalId ? { ...modal, ...updates } : modal
      )
    }));
  }

  // Notification Management
  /**
   * Add a notification
   */
  addNotification(notification: Omit<NotificationState, 'id' | 'timestamp'>): void {
    const newNotification: NotificationState = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date()
    };

    this.updateState(currentState => ({
      ...currentState,
      notifications: [...currentState.notifications, newNotification]
    }));

    // Auto-remove non-persistent notifications
    if (!newNotification.persistent && newNotification.duration !== 0) {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, newNotification.duration || 5000);
    }
  }

  /**
   * Remove a notification by ID
   */
  removeNotification(notificationId: string): void {
    this.updateState(currentState => ({
      ...currentState,
      notifications: currentState.notifications.filter(notification => notification.id !== notificationId)
    }));
  }

  /**
   * Clear all notifications
   */
  clearNotifications(): void {
    this.patchState({ notifications: [] });
  }

  /**
   * Clear notifications by type
   */
  clearNotificationsByType(type: NotificationState['type']): void {
    this.updateState(currentState => ({
      ...currentState,
      notifications: currentState.notifications.filter(notification => notification.type !== type)
    }));
  }

  // Navigation Management
  /**
   * Set current route
   */
  setCurrentRoute(route: string): void {
    this.updateState(currentState => ({
      ...currentState,
      navigation: {
        ...currentState.navigation,
        currentRoute: route
      }
    }));
  }

  /**
   * Set breadcrumbs
   */
  setBreadcrumbs(breadcrumbs: UiState['navigation']['breadcrumbs']): void {
    this.updateState(currentState => ({
      ...currentState,
      navigation: {
        ...currentState.navigation,
        breadcrumbs
      }
    }));
  }

  /**
   * Toggle sidebar
   */
  toggleSidebar(): void {
    this.updateState(currentState => ({
      ...currentState,
      navigation: {
        ...currentState.navigation,
        sidebarOpen: !currentState.navigation.sidebarOpen
      }
    }));
  }

  /**
   * Set sidebar state
   */
  setSidebarOpen(open: boolean): void {
    this.updateState(currentState => ({
      ...currentState,
      navigation: {
        ...currentState.navigation,
        sidebarOpen: open
      }
    }));
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu(): void {
    this.updateState(currentState => ({
      ...currentState,
      navigation: {
        ...currentState.navigation,
        mobileMenuOpen: !currentState.navigation.mobileMenuOpen
      }
    }));
  }

  /**
   * Set mobile menu state
   */
  setMobileMenuOpen(open: boolean): void {
    this.updateState(currentState => ({
      ...currentState,
      navigation: {
        ...currentState.navigation,
        mobileMenuOpen: open
      }
    }));
  }

  /**
   * Set active tab
   */
  setActiveTab(tab: string): void {
    this.updateState(currentState => ({
      ...currentState,
      navigation: {
        ...currentState.navigation,
        activeTab: tab
      }
    }));
  }

  // Responsive Management
  /**
   * Update screen size and responsive state
   */
  updateScreenSize(width: number, height: number): void {
    const screenSize = this.getScreenSize(width);
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;

    this.updateState(currentState => ({
      ...currentState,
      responsive: {
        screenSize,
        isMobile,
        isTablet,
        isDesktop,
        width,
        height
      }
    }));
  }

  /**
   * Get screen size from width
   */
  private getScreenSize(width: number): ScreenSize {
    if (width < 640) return 'xs';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    if (width < 1280) return 'lg';
    if (width < 1536) return 'xl';
    return '2xl';
  }

  /**
   * Generate unique ID for notifications/modals
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}