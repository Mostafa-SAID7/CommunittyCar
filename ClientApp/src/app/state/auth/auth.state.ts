import { User } from '../../../core/models/user.model';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isEmailVerified: boolean;
  is2FAEnabled: boolean;
  is2FARequired: boolean;
  socialLoginProviders: string[];
  lastLoginAttempt: Date | null;
  loginAttempts: number;
  isLocked: boolean;
  lockoutUntil: Date | null;
  permissions: string[];
  roles: string[];
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isEmailVerified: false,
  is2FAEnabled: false,
  is2FARequired: false,
  socialLoginProviders: [],
  lastLoginAttempt: null,
  loginAttempts: 0,
  isLocked: false,
  lockoutUntil: null,
  permissions: [],
  roles: []
};