import { TestBed } from '@angular/core/testing';
import { AuthSignalStore } from './auth.store';
import { AuthResponse, User } from '../models/auth.model';
import { initialAuthState } from './auth.state';

describe('AuthSignalStore', () => {
  let store: AuthSignalStore;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    roles: ['user'],
    isEmailVerified: true,
    is2FAEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockAuthResponse: AuthResponse = {
    token: 'mock-token',
    refreshToken: 'mock-refresh-token',
    user: mockUser,
    expiresIn: 3600
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(AuthSignalStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have initial state', () => {
      const state = store.getState();
      expect(state).toEqual(initialAuthState);
    });
  });

  describe('setAuthData', () => {
    it('should set authentication data correctly', () => {
      store.setAuthData(mockAuthResponse);

      const state = store.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('mock-token');
      expect(state.refreshToken).toBe('mock-refresh-token');
      expect(state.isAuthenticated).toBeTruthy();
      expect(state.isEmailVerified).toBeTruthy();
      expect(state.is2FAEnabled).toBeFalsy();
      expect(state.roles).toEqual(['user']);
      expect(state.permissions).toEqual(['view_cars', 'create_booking', 'manage_own_profile']);
      expect(state.error).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user data', () => {
      store.setAuthData(mockAuthResponse);

      const updatedUser = { ...mockUser, name: 'Updated Name' };
      store.updateUser(updatedUser);

      const state = store.getState();
      expect(state.user?.name).toBe('Updated Name');
      expect(state.isEmailVerified).toBeTruthy();
      expect(state.is2FAEnabled).toBeFalsy();
      expect(state.roles).toEqual(['user']);
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      store.setLoading(true);
      expect(store.getState().isLoading).toBeTruthy();

      store.setLoading(false);
      expect(store.getState().isLoading).toBeFalsy();
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      store.setError('Test error');
      expect(store.getState().error).toBe('Test error');

      store.setError(null);
      expect(store.getState().error).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      store.setError('Test error');
      store.clearError();
      expect(store.getState().error).toBeNull();
    });
  });

  describe('logout', () => {
    it('should reset state on logout', () => {
      store.setAuthData(mockAuthResponse);
      store.setLoading(true);
      store.setError('Some error');

      store.logout();

      const state = store.getState();
      expect(state).toEqual(initialAuthState);
    });
  });

  describe('set2FAEnabled', () => {
    it('should enable 2FA', () => {
      store.setAuthData(mockAuthResponse);
      store.set2FAEnabled(true);

      const state = store.getState();
      expect(state.is2FAEnabled).toBeTruthy();
      expect(state.user?.is2FAEnabled).toBeTruthy();
    });

    it('should disable 2FA', () => {
      const userWith2FA = { ...mockUser, is2FAEnabled: true };
      const authResponseWith2FA = { ...mockAuthResponse, user: userWith2FA };
      store.setAuthData(authResponseWith2FA);

      store.set2FAEnabled(false);

      const state = store.getState();
      expect(state.is2FAEnabled).toBeFalsy();
      expect(state.user?.is2FAEnabled).toBeFalsy();
    });
  });

  describe('setEmailVerified', () => {
    it('should set email as verified', () => {
      const userNotVerified = { ...mockUser, isEmailVerified: false };
      const authResponseNotVerified = { ...mockAuthResponse, user: userNotVerified };
      store.setAuthData(authResponseNotVerified);

      store.setEmailVerified(true);

      const state = store.getState();
      expect(state.isEmailVerified).toBeTruthy();
      expect(state.user?.isEmailVerified).toBeTruthy();
    });
  });

  describe('updateLoginAttempt', () => {
    it('should update login attempt on success', () => {
      store.updateLoginAttempt(true);

      const state = store.getState();
      expect(state.lastLoginAttempt).toBeDefined();
      expect(state.loginAttempts).toBe(0);
      expect(state.isLocked).toBeFalsy();
      expect(state.lockoutUntil).toBeNull();
      expect(state.error).toBeNull();
    });

    it('should update login attempt on failure', () => {
      store.updateLoginAttempt(false);

      const state = store.getState();
      expect(state.lastLoginAttempt).toBeDefined();
      expect(state.loginAttempts).toBe(1);
      expect(state.isLocked).toBeFalsy();
      expect(state.error).toBe('Invalid credentials');
    });

    it('should lock account after 5 failed attempts', () => {
      // Simulate 4 failed attempts
      for (let i = 0; i < 4; i++) {
        store.updateLoginAttempt(false);
      }

      // 5th failed attempt should lock
      store.updateLoginAttempt(false);

      const state = store.getState();
      expect(state.loginAttempts).toBe(5);
      expect(state.isLocked).toBeTruthy();
      expect(state.lockoutUntil).toBeDefined();
    });
  });

  describe('isAccountLocked', () => {
    it('should return false when not locked', () => {
      expect(store.isAccountLocked()).toBeFalsy();
    });

    it('should return true when locked and lockout time not passed', () => {
      // Lock the account
      for (let i = 0; i < 5; i++) {
        store.updateLoginAttempt(false);
      }

      expect(store.isAccountLocked()).toBeTruthy();
    });

    it('should return false when lockout time has passed', () => {
      // Lock the account
      for (let i = 0; i < 5; i++) {
        store.updateLoginAttempt(false);
      }

      // Manually set lockout time to past
      const pastTime = new Date(Date.now() - 20 * 60 * 1000); // 20 minutes ago
      store['state'].update(current => ({ ...current, lockoutUntil: pastTime }));

      expect(store.isAccountLocked()).toBeFalsy();
    });
  });

  describe('extractPermissions', () => {
    it('should extract permissions for admin role', () => {
      const adminUser = { ...mockUser, roles: ['admin'] };
      const authResponse = { ...mockAuthResponse, user: adminUser };
      store.setAuthData(authResponse);

      const state = store.getState();
      expect(state.permissions).toContain('manage_users');
      expect(state.permissions).toContain('manage_cars');
      expect(state.permissions).toContain('manage_bookings');
      expect(state.permissions).toContain('view_reports');
    });

    it('should extract permissions for user role', () => {
      store.setAuthData(mockAuthResponse);

      const state = store.getState();
      expect(state.permissions).toContain('view_cars');
      expect(state.permissions).toContain('create_booking');
      expect(state.permissions).toContain('manage_own_profile');
    });

    it('should handle multiple roles', () => {
      const multiRoleUser = { ...mockUser, roles: ['admin', 'user'] };
      const authResponse = { ...mockAuthResponse, user: multiRoleUser };
      store.setAuthData(authResponse);

      const state = store.getState();
      expect(state.permissions).toContain('manage_users');
      expect(state.permissions).toContain('view_cars');
    });
  });
});