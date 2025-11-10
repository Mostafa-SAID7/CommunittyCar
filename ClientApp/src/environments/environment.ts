export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Community Car',
  version: '1.0.0',
  features: {
    enableRegistration: true,
    enableCarListing: true,
    enableBooking: true,
    enablePayment: false,
    enableNotifications: true,
    enableThemeToggle: true,
  },
  thirdParty: {
    googleMapsApiKey: '',
    stripePublishableKey: '',
    firebaseConfig: {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    },
  },
  security: {
    tokenExpirationTime: 3600000, // 1 hour in milliseconds
    refreshTokenExpirationTime: 604800000, // 7 days in milliseconds
    passwordMinLength: 8,
    enableTwoFactorAuth: false,
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  cache: {
    defaultTtl: 300000, // 5 minutes in milliseconds
  },
  logging: {
    level: 'debug',
    enableRemoteLogging: false,
  },
};