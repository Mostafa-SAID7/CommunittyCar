export const environment = {
  production: true,
  apiUrl: 'https://api.communitycar.com/api',
  appName: 'Community Car',
  version: '1.0.0',
  features: {
    enableRegistration: true,
    enableCarListing: true,
    enableBooking: true,
    enablePayment: true,
    enableNotifications: true,
    enableThemeToggle: true,
  },
  thirdParty: {
    googleMapsApiKey: 'your-production-google-maps-api-key',
    stripePublishableKey: 'pk_live_your-stripe-live-key',
    firebaseConfig: {
      apiKey: 'your-prod-api-key',
      authDomain: 'your-prod-project.firebaseapp.com',
      projectId: 'your-prod-project',
      storageBucket: 'your-prod-project.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:abcdef123456',
    },
  },
  security: {
    tokenExpirationTime: 3600000, // 1 hour
    refreshTokenExpirationTime: 604800000, // 7 days
    passwordMinLength: 8,
    enableTwoFactorAuth: true,
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  cache: {
    defaultTtl: 600000, // 10 minutes
  },
  logging: {
    level: 'error',
    enableRemoteLogging: true,
  },
  analytics: {
    enableGoogleAnalytics: true,
    trackingId: 'GA_TRACKING_ID',
  },
  performance: {
    enableMonitoring: true,
    enableErrorTracking: true,
  },
};