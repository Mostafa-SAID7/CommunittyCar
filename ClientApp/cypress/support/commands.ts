// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

// Custom command to login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-cy="email"]').type(email);
  cy.get('[data-cy="password"]').type(password);
  cy.get('[data-cy="login-button"]').click();
});

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="logout-button"]').click();
});

// Custom command to register
Cypress.Commands.add('register', (name: string, email: string, password: string) => {
  cy.visit('/register');
  cy.get('[data-cy="name"]').type(name);
  cy.get('[data-cy="register-email"]').type(email);
  cy.get('[data-cy="register-password"]').type(password);
  cy.get('[data-cy="confirm-password"]').type(password);
  cy.get('[data-cy="accept-terms"]').check();
  cy.get('[data-cy="register-button"]').click();
});

// Custom command to verify email
Cypress.Commands.add('verifyEmail', () => {
  cy.get('[data-cy="go-to-login"]').click();
});

// Custom command to setup 2FA
Cypress.Commands.add('setup2FA', (code: string) => {
  cy.get('[data-cy="2fa-code-input"]').type(code);
  cy.get('[data-cy="verify-2fa-button"]').click();
});

// Custom command to login with 2FA
Cypress.Commands.add('loginWith2FA', (email: string, password: string, code: string) => {
  cy.login(email, password);
  cy.get('[data-cy="2fa-code-input"]').type(code);
  cy.get('[data-cy="verify-2fa-button"]').click();
});

// Custom command to wait for loading
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-cy="loading-spinner"]', { timeout: 10000 }).should('not.exist');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      register(name: string, email: string, password: string): Chainable<void>;
      verifyEmail(): Chainable<void>;
      setup2FA(code: string): Chainable<void>;
      loginWith2FA(email: string, password: string, code: string): Chainable<void>;
      waitForLoading(): Chainable<void>;
    }
  }
}