export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  avatar?: string;
  profilePicture?: string;
  coverPhoto?: string;
  isEmailVerified: boolean;
  is2FAEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}

export interface SocialLoginRequest {
  provider: string;
  token: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface GenerateOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface Enable2FARequest {
  // 2FA setup data
}

export interface Disable2FARequest {
  // 2FA disable data
}

// Legacy interfaces for backward compatibility
export interface ForgotPasswordRequest {
  email: string;
}

export interface OtpVerificationRequest {
  email: string;
  otp: string;
}