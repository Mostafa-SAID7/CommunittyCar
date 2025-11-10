export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
    OTP_VERIFICATION: '/api/auth/otp-verification',
  },
  CARS: '/api/cars',
  BOOKINGS: '/api/bookings',
  PROFILE: '/api/profile',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  OWNER: 'owner',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
};

export const FUEL_TYPES = [
  'petrol',
  'diesel',
  'electric',
  'hybrid',
];

export const TRANSMISSION_TYPES = [
  'manual',
  'automatic',
];

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};