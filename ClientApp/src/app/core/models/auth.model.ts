export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface OtpVerificationRequest {
  email: string;
  otp: string;
}