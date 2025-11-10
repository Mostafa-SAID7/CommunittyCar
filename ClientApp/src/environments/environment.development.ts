export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Community Car (Development)',
  version: '1.0.0-dev',
  features: {
    enableRegistration: true,
    enableCarListing: true,
    enableBooking: true,
    enablePayment: false,
    enableNotifications: true,
    enableThemeToggle: true,
  },
  thirdParty: {
    googleMapsApiKey: 'your-development-google-maps-api-key',
    stripePublishableKey: 'pk_test_your-stripe-test-key',
    firebaseConfig: {
      apiKey: 'your-dev-api-key',
      authDomain: 'your-dev-project.firebaseapp.com',
      projectId: 'your-dev-project',
      storageBucket: 'your-dev-project.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:abcdef123456',
    },
  },
  security: {
    tokenExpirationTime: 3600000, // 1 hour
    refreshTokenExpirationTime: 604800000, // 7 days
    passwordMinLength: 8,
    enableTwoFactorAuth: false,
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  cache: {
    defaultTtl: 300000, // 5 minutes
  },
  logging: {
    level: 'debug',
    enableRemoteLogging: false,
  },
  debug: {
    enableConsoleLogs: true,
    enableApiLogging: true,
    enablePerformanceMonitoring: false,
  },
};