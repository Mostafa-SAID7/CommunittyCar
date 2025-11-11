import { createSelector, createMemoizedSelector, createCombinedSelector } from './signal-selectors';
import { AuthSignalStore } from './auth.store';
import { User } from '../models/user.model';

/**
 * Auth selectors for accessing authentication state
 */

// Basic state selectors
export const selectAuthState = (store: AuthSignalStore) => store.select(state => state);
export const selectUser = (store: AuthSignalStore) => store.select(state => state.user);
export const selectToken = (store: AuthSignalStore) => store.select(state => state.token);
export const selectRefreshToken = (store: AuthSignalStore) => store.select(state => state.refreshToken);
export const selectIsAuthenticated = (store: AuthSignalStore) => store.select(state => state.isAuthenticated);
export const selectIsLoading = (store: AuthSignalStore) => store.select(state => state.isLoading);
export const selectError = (store: AuthSignalStore) => store.select(state => state.error);
export const selectIsEmailVerified = (store: AuthSignalStore) => store.select(state => state.isEmailVerified);
export const selectIs2FAEnabled = (store: AuthSignalStore) => store.select(state => state.is2FAEnabled);
export const selectIs2FARequired = (store: AuthSignalStore) => store.select(state => state.is2FARequired);
export const selectRoles = (store: AuthSignalStore) => store.select(state => state.roles);
export const selectPermissions = (store: AuthSignalStore) => store.select(state => state.permissions);

// User-related selectors
export const selectUserId = (store: AuthSignalStore) => store.select(state => state.user?.id || null);

export const selectUserName = (store: AuthSignalStore) => store.select(state => state.user?.name || null);

export const selectUserEmail = (store: AuthSignalStore) => store.select(state => state.user?.email || null);

export const selectUserAvatar = (store: AuthSignalStore) => store.select(state => state.user?.avatar || state.user?.profilePicture || null);

export const selectUserRoles = (store: AuthSignalStore) => store.select(state => state.user?.roles || []);

// Role and permission checks
export const selectHasRole = (role: string) => (store: AuthSignalStore) => store.select(state => state.roles.includes(role));

export const selectHasPermission = (permission: string) => (store: AuthSignalStore) => store.select(state => state.permissions.includes(permission));

export const selectIsAdmin = (store: AuthSignalStore) => store.select(state => state.roles.includes('admin'));
export const selectIsUser = (store: AuthSignalStore) => store.select(state => state.roles.includes('user'));

// Account status selectors
export const selectIsAccountLocked = (store: AuthSignalStore) => store.select(
  state => state.isLocked && state.lockoutUntil ? new Date() < state.lockoutUntil : false
);

export const selectLockoutTimeRemaining = (store: AuthSignalStore) => store.select(
  state => {
    if (!state.isLocked || !state.lockoutUntil) return 0;
    const remaining = state.lockoutUntil.getTime() - new Date().getTime();
    return Math.max(0, Math.floor(remaining / 1000)); // seconds remaining
  }
);

export const selectLoginAttempts = (store: AuthSignalStore) => store.select(
  state => state.loginAttempts
);

// Combined selectors
export const selectAuthStatus = (store: AuthSignalStore) => createCombinedSelector(
  [selectIsAuthenticated(store), selectIsLoading(store), selectError(store)],
  (isAuthenticated, isLoading, error) => ({
    isAuthenticated,
    isLoading,
    error,
    hasError: !!error
  })
);

export const selectUserProfile = (store: AuthSignalStore) => createCombinedSelector(
  [selectUser(store), selectIsEmailVerified(store), selectIs2FAEnabled(store)],
  (user, isEmailVerified, is2FAEnabled) => ({
    user,
    isEmailVerified,
    is2FAEnabled,
    isProfileComplete: !!(user?.name && user?.email && isEmailVerified)
  })
);

export const selectSecurityStatus = (store: AuthSignalStore) => createCombinedSelector(
  [selectIsEmailVerified(store), selectIs2FAEnabled(store), selectIs2FARequired(store)],
  (isEmailVerified, is2FAEnabled, is2FARequired) => ({
    isEmailVerified,
    is2FAEnabled,
    is2FARequired,
    securityLevel: calculateSecurityLevel(isEmailVerified, is2FAEnabled, is2FARequired)
  })
);

// Helper function for security level calculation
function calculateSecurityLevel(isEmailVerified: boolean, is2FAEnabled: boolean, is2FARequired: boolean): 'low' | 'medium' | 'high' {
  if (isEmailVerified && is2FAEnabled) return 'high';
  if (isEmailVerified || is2FAEnabled) return 'medium';
  return 'low';
}

// Memoized selectors for performance
export const selectUserDisplayName = (store: AuthSignalStore) => store.select(
  state => state.user?.name || state.user?.email?.split('@')[0] || 'User'
);

export const selectCanAccessAdmin = (store: AuthSignalStore) => store.select(
  state => state.roles.includes('admin') || state.roles.includes('moderator')
);