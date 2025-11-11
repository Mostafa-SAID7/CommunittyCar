export const environment = {
  production: false,
  apiUrl: 'https://api.communitycar.com/api/v1',
  wsUrl: 'wss://api.communitycar.com/ws',
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
    apiKey: 'your-google-maps-api-key'
  },
  payment: {
    stripePublishableKey: 'pk_test_your_stripe_key',
    currency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    commissionRate: 0.1, // 10%
    minimumBookingAmount: 10
  },
  social: {
    googleClientId: 'your-google-client-id',
    facebookAppId: 'your-facebook-app-id',
    twitterApiKey: 'your-twitter-api-key',
    linkedinClientId: 'your-linkedin-client-id'
  },
  analytics: {
    googleAnalyticsId: 'GA_MEASUREMENT_ID',
    mixpanelToken: 'your-mixpanel-token',
    sentryDsn: 'your-sentry-dsn'
  },
  logging: {
    level: 'debug',
    remoteLogging: false,
    logToConsole: true,
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
    enableSound: true,
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
    defaultTtl: 5 * 60 * 1000, // 5 minutes
    maxCacheSize: 50 * 1024 * 1024, // 50MB
    enableOfflineMode: true
  }
};