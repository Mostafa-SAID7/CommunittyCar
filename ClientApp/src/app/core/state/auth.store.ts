import { Injectable } from '@angular/core';
import { BaseSignalStore } from './base-signal-store';
import { AuthState, initialAuthState } from './auth.state';
import { User } from '../models/user.model';
import { AuthResponse } from '../models/auth.model';

/**
 * Auth signal store for managing authentication state
 */
@Injectable({
  providedIn: 'root'
})
export class AuthSignalStore extends BaseSignalStore<AuthState> {
  constructor() {
    super(initialAuthState);
  }

  /**
   * Reset auth state to initial values
   */
  reset(): void {
    this.setState(initialAuthState);
  }

  /**
   * Set user authentication data
   */
  setAuthData(authResponse: AuthResponse): void {
    this.updateState(currentState => ({
      ...currentState,
      user: authResponse.user,
      token: authResponse.token,
      refreshToken: authResponse.refreshToken,
      isAuthenticated: true,
      isEmailVerified: authResponse.user.isEmailVerified ?? false,
      is2FAEnabled: authResponse.user.is2FAEnabled ?? false,
      roles: authResponse.user.roles,
      permissions: this.extractPermissions(authResponse.user.roles),
      error: null
    }));
  }

  /**
   * Update user profile data
   */
  updateUser(user: User): void {
    this.updateState(currentState => ({
      ...currentState,
      user,
      isEmailVerified: user.isEmailVerified ?? false,
      is2FAEnabled: user.is2FAEnabled ?? false,
      roles: user.roles,
      permissions: this.extractPermissions(user.roles)
    }));
  }

  /**
   * Set authentication loading state
   */
  setLoading(isLoading: boolean): void {
    this.patchState({ isLoading });
  }

  /**
   * Set authentication error
   */
  setError(error: string | null): void {
    this.patchState({ error });
  }

  /**
   * Clear authentication error
   */
  clearError(): void {
    this.patchState({ error: null });
  }

  /**
   * Logout user
   */
  logout(): void {
    this.reset();
  }

  /**
   * Set 2FA status
   */
  set2FAEnabled(enabled: boolean): void {
    this.updateState(currentState => ({
      ...currentState,
      is2FAEnabled: enabled,
      user: currentState.user ? { ...currentState.user, is2FAEnabled: enabled } : null
    }));
  }

  /**
   * Set email verification status
   */
  setEmailVerified(verified: boolean): void {
    this.updateState(currentState => ({
      ...currentState,
      isEmailVerified: verified,
      user: currentState.user ? { ...currentState.user, isEmailVerified: verified } : null
    }));
  }

  /**
   * Update login attempt tracking
   */
  updateLoginAttempt(success: boolean): void {
    const now = new Date();
    this.updateState(currentState => ({
      ...currentState,
      lastLoginAttempt: now,
      loginAttempts: success ? 0 : currentState.loginAttempts + 1,
      isLocked: !success && currentState.loginAttempts + 1 >= 5,
      lockoutUntil: !success && currentState.loginAttempts + 1 >= 5 ? new Date(now.getTime() + 15 * 60 * 1000) : null,
      error: success ? null : 'Invalid credentials'
    }));
  }

  /**
   * Check if account is locked
   */
  isAccountLocked(): boolean {
    const state = this.getState();
    if (!state.isLocked || !state.lockoutUntil) return false;
    return new Date() < state.lockoutUntil;
  }

  /**
   * Extract permissions from roles (simplified implementation)
   */
  private extractPermissions(roles: string[]): string[] {
    const permissions: string[] = [];

    if (roles.includes('admin')) {
      permissions.push('manage_users', 'manage_cars', 'manage_bookings', 'view_reports');
    }

    if (roles.includes('user')) {
      permissions.push('view_cars', 'create_booking', 'manage_own_profile');
    }

    return permissions;
  }
}