export const environment = {
  production: true,
  apiUrl: 'https://api.communitycar.com/api',
  wsUrl: 'wss://api.communitycar.com',
  appName: 'Community Car',
  appVersion: '1.0.0',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'ar'],
  features: {
    socialLogin: true,
    twoFactorAuth: true,
    notifications: true,
    liveChat: true,
    themeSwitching: true,
    profilePictures: true,
    coverPhotos: true,
    advancedSearch: true,
    realTimeUpdates: true
  },
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 50
  },
  fileUpload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxProfilePictureSize: 2 * 1024 * 1024, // 2MB
    maxCoverPhotoSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  map: {
    defaultCenter: {
      lat: 40.7128,
      lng: -74.0060
    },
    defaultZoom: 12,
    apiKey: 'your-production-google-maps-api-key'
  },
  payment: {
    stripePublishableKey: 'pk_live_your_stripe_key',
    currency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    commissionRate: 0.1, // 10%
    minimumBookingAmount: 10
  },
  social: {
    googleClientId: 'your-production-google-client-id',
    facebookAppId: 'your-production-facebook-app-id',
    twitterApiKey: 'your-production-twitter-api-key',
    linkedinClientId: 'your-production-linkedin-client-id'
  },
  analytics: {
    googleAnalyticsId: 'GA_MEASUREMENT_ID_PROD',
    mixpanelToken: 'your-production-mixpanel-token',
    sentryDsn: 'your-production-sentry-dsn'
  },
  logging: {
    level: 'error',
    remoteLogging: true,
    logToConsole: false,
    logToFile: false
  },
  security: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true
  },
  notifications: {
    enableSound: false,
    enableVibration: false,
    maxNotifications: 50,
    autoHideToasters: true,
    defaultToastDuration: 3000
  },
  chat: {
    maxMessageLength: 1000,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFileTypes: ['image/*', 'application/pdf', 'text/*'],
    enableTypingIndicators: true,
    enableReadReceipts: true
  },
  cache: {
    defaultTtl: 10 * 60 * 1000, // 10 minutes
    maxCacheSize: 100 * 1024 * 1024, // 100MB
    enableOfflineMode: false
  }
};