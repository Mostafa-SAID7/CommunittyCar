import { Injectable, inject } from '@angular/core';
import { AuthSignalStore } from './auth.store';
import { UiSignalStore } from './ui.store';
import { CarsSignalStore } from './cars.store';
import { BookingsSignalStore } from './bookings.store';

/**
 * App signal store that composes all individual stores for global state management
 */
@Injectable({
  providedIn: 'root'
})
export class AppSignalStore {
  // Inject all individual stores
  readonly auth = inject(AuthSignalStore);
  readonly ui = inject(UiSignalStore);
  readonly cars = inject(CarsSignalStore);
  readonly bookings = inject(BookingsSignalStore);

  constructor() {}

  /**
   * Reset all stores to their initial state
   */
  reset(): void {
    this.auth.reset();
    this.ui.reset();
    this.cars.reset();
    this.bookings.reset();
  }

  /**
   * Initialize app state - called on app startup
   */
  initialize(): void {
    // Load initial data if needed
    // This could include loading user preferences, cached data, etc.
    this.ui.updateScreenSize(window.innerWidth, window.innerHeight);

    // Listen for window resize events
    window.addEventListener('resize', () => {
      this.ui.updateScreenSize(window.innerWidth, window.innerHeight);
    });
  }

  /**
   * Global loading state - true if any store is loading
   */
  get isLoading(): boolean {
    return this.auth.getState().isLoading ||
           this.ui.getState().loading.isLoading ||
           this.cars.getState().isLoading ||
           this.bookings.getState().isLoading;
  }

  /**
   * Global error state - returns first error found across stores
   */
  get globalError(): string | null {
    return this.auth.getState().error ||
           this.ui.getState().notifications.find(n => n.type === 'error')?.message ||
           this.cars.getState().error ||
           this.bookings.getState().error ||
           null;
  }

  /**
   * Clear all errors across stores
   */
  clearAllErrors(): void {
    this.auth.clearError();
    this.ui.clearNotifications();
    this.cars.clearError();
    this.bookings.clearError();
  }

  /**
   * Check if user is authenticated and has required permissions
   */
  hasPermission(permission: string): boolean {
    const authState = this.auth.getState();
    return authState.isAuthenticated && authState.permissions.includes(permission);
  }

  /**
   * Check if user has role
   */
  hasRole(role: string): boolean {
    return this.auth.getState().roles.includes(role);
  }

  /**
   * Get current user
   */
  get currentUser() {
    return this.auth.getState().user;
  }

  /**
   * Logout from all stores
   */
  logout(): void {
    this.auth.logout();
    this.cars.reset();
    this.bookings.reset();
    // Keep UI state but clear user-specific data
    this.ui.clearNotifications();
    this.ui.closeAllModals();
  }
}