import '../support/commands';

describe('Authentication Flow', () => {
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'TestPass123!',
    otpCode: '123456', // Mock OTP code
    twoFACode: '123456' // Mock 2FA code
  };

  beforeEach(() => {
    cy.visit('/');
  });

  it('should complete full authentication flow: register → login → email verification → 2FA setup', () => {
    // Step 1: Register new user
    cy.register(testUser.name, testUser.email, testUser.password);
    cy.waitForLoading();

    // Should redirect to email verification page
    cy.url().should('include', '/verify-email');

    // Step 2: Verify email
    cy.verifyEmail();
    cy.url().should('include', '/login');

    // Step 3: Login with registered credentials
    cy.login(testUser.email, testUser.password);
    cy.waitForLoading();

    // Should redirect to OTP verification (assuming email verification triggers OTP)
    cy.url().should('include', '/otp-verification');

    // Step 4: Enter OTP code
    cy.get('[data-cy="otp-input"]').type(testUser.otpCode);
    cy.get('[data-cy="verify-otp-button"]').click();
    cy.waitForLoading();

    // Should redirect to 2FA setup
    cy.url().should('include', '/setup-2fa');

    // Step 5: Setup 2FA
    cy.setup2FA(testUser.twoFACode);
    cy.waitForLoading();

    // Should redirect to dashboard after successful 2FA setup
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');

    // Step 6: Logout
    cy.logout();
    cy.url().should('include', '/login');
  });

  it('should login with 2FA enabled user', () => {
    // Assuming user has 2FA enabled from previous test
    cy.login(testUser.email, testUser.password);
    cy.waitForLoading();

    // Should prompt for 2FA code
    cy.url().should('include', '/otp-verification');

    // Enter 2FA code
    cy.get('[data-cy="otp-input"]').type(testUser.twoFACode);
    cy.get('[data-cy="verify-otp-button"]').click();
    cy.waitForLoading();

    // Should login successfully
    cy.url().should('include', '/dashboard');
  });

  it('should handle invalid registration data', () => {
    cy.visit('/register');

    // Try to register with invalid data
    cy.get('[data-cy="name"]').type('A'); // Too short
    cy.get('[data-cy="register-email"]').type('invalid-email'); // Invalid email
    cy.get('[data-cy="register-password"]').type('123'); // Too short
    cy.get('[data-cy="confirm-password"]').type('123');
    cy.get('[data-cy="accept-terms"]').check();

    // Button should be disabled due to invalid form
    cy.get('[data-cy="register-button"]').should('be.disabled');
  });

  it('should handle invalid login credentials', () => {
    cy.login('invalid@example.com', 'wrongpassword');

    // Should stay on login page or show error
    cy.url().should('include', '/login');
    // Error message should be visible (assuming error handling is implemented)
  });

  it('should handle forgot password flow', () => {
    cy.visit('/login');
    cy.get('a[href="/forgot-password"]').click();
    cy.url().should('include', '/forgot-password');

    // Enter email for password reset
    cy.get('[data-cy="email"]').type(testUser.email);
    cy.get('[data-cy="reset-password-button"]').click();

    // Should show success message or redirect
    cy.contains('Password reset').should('be.visible');
  });

  it('should allow skipping 2FA setup', () => {
    // Register new user for this test
    const skipUser = {
      name: 'Skip User',
      email: 'skipuser@example.com',
      password: 'SkipPass123!'
    };

    cy.register(skipUser.name, skipUser.email, skipUser.password);
    cy.verifyEmail();

    // Login and go through OTP
    cy.login(skipUser.email, skipUser.password);
    cy.get('[data-cy="otp-input"]').type('123456');
    cy.get('[data-cy="verify-otp-button"]').click();

    // Skip 2FA setup
    cy.get('[data-cy="skip-2fa-button"]').click();

    // Should go to dashboard
    cy.url().should('include', '/dashboard');
  });
});