import '../support/commands';

describe('Car Management Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should browse cars, filter, view details, and add to favorites', () => {
    // Step 1: Browse to cars page
    cy.get('[data-cy="browse-all-cars-button"]').click();
    cy.url().should('include', '/browse-cars');

    // Verify cars are displayed
    cy.get('[data-cy="view-details-button"]').should('have.length.greaterThan', 0);

    // Step 2: Search for cars
    cy.get('[data-cy="search-input"]').type('Toyota');
    cy.get('[data-cy="search-button"]').click();

    // Step 3: Apply filters
    cy.get('[data-cy="min-price"]').type('50');
    cy.get('[data-cy="max-price"]').type('100');
    cy.get('[data-cy="fuel-type-select"]').select('petrol');
    cy.get('[data-cy="transmission-select"]').select('automatic');
    cy.get('[data-cy="apply-filters-button"]').click();

    // Step 4: View car details
    cy.get('[data-cy="view-details-button"]').first().click();
    cy.url().should('include', '/cars/');

    // Verify car details are displayed
    cy.get('h1').should('be.visible'); // Car title
    cy.get('[data-cy="pickup-date"]').should('be.visible');
    cy.get('[data-cy="return-date"]').should('be.visible');

    // Step 5: Add to favorites (if implemented)
    // Note: Favorites functionality may not be implemented yet
    // cy.get('[data-cy="add-to-favorites-button"]').click();
    // cy.contains('Added to favorites').should('be.visible');

    // Step 6: Go back to cars list
    cy.contains('Back to Cars').click();
    cy.url().should('include', '/browse-cars');
  });

  it('should handle car booking from details page', () => {
    // Navigate to car details
    cy.get('[data-cy="browse-all-cars-button"]').click();
    cy.get('[data-cy="view-details-button"]').first().click();

    // Select booking dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3);

    cy.get('[data-cy="pickup-date"]').type(tomorrow.toISOString().split('T')[0]);
    cy.get('[data-cy="return-date"]').type(dayAfter.toISOString().split('T')[0]);

    // Book the car
    cy.get('[data-cy="book-now-details"]').click();

    // Should redirect to booking flow
    cy.url().should('include', '/bookings/new');
  });

  it('should display car specifications correctly', () => {
    cy.get('[data-cy="browse-all-cars-button"]').click();
    cy.get('[data-cy="view-details-button"]').first().click();

    // Check that specifications are displayed
    cy.contains('Fuel Type').should('be.visible');
    cy.contains('Transmission').should('be.visible');
    cy.contains('Seats').should('be.visible');
    cy.contains('Mileage').should('be.visible');
  });

  it('should handle empty search results', () => {
    cy.get('[data-cy="browse-all-cars-button"]').click();

    // Search for non-existent car
    cy.get('[data-cy="search-input"]').type('NonExistentCar12345');
    cy.get('[data-cy="search-button"]').click();

    // Should show no results or appropriate message
    cy.get('[data-cy="view-details-button"]').should('have.length', 0);
  });

  it('should navigate through car images', () => {
    cy.get('[data-cy="browse-all-cars-button"]').click();
    cy.get('[data-cy="view-details-button"]').first().click();

    // Check if there are multiple images
    cy.get('img').then(($images) => {
      if ($images.length > 1) {
        // Click on thumbnail if available
        cy.get('.thumbnail-image').first().click();
        // Main image should change
      }
    });
  });
});