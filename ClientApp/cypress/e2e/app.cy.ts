describe('Community Car App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the home page', () => {
    cy.contains('Welcome to Community Car').should('be.visible');
  });

  it('should navigate to login page', () => {
    cy.get('[data-cy="login-link"]').click();
    cy.url().should('include', '/login');
    cy.contains('Login').should('be.visible');
  });

  it('should login with valid credentials', () => {
    cy.fixture('users').then((users) => {
      const user = users[0]; // admin user
      cy.login(user.email, user.password);
      cy.url().should('include', '/dashboard');
    });
  });

  it('should logout', () => {
    cy.fixture('users').then((users) => {
      const user = users[0];
      cy.login(user.email, user.password);
      cy.logout();
      cy.url().should('include', '/login');
    });
  });
});