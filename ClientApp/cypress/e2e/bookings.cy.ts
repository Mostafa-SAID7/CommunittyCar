import '../support/commands';

describe('Booking Flow', () => {
  const testUser = {
    email: 'user@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    // Login first
    cy.login(testUser.email, testUser.password);
    cy.waitForLoading();
  });

  it('should complete full booking flow: select car → create booking → payment → confirmation', () => {
    // Step 1: Select a car from browse page
    cy.visit('/browse-cars');
    cy.get('[data-cy="view-details-button"]').first().click();

    // Step 2: Create booking
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3);

    cy.get('[data-cy="pickup-date"]').type(tomorrow.toISOString().split('T')[0]);
    cy.get('[data-cy="return-date"]').type(dayAfter.toISOString().split('T')[0]);

    // Fill pickup location
    cy.get('[data-cy="pickup-address"]').type('123 Main Street');
    cy.get('[data-cy="pickupLocation.city"]').type('New York');
    cy.get('[data-cy="pickupLocation.state"]').type('NY');
    cy.get('[data-cy="pickupLocation.zipCode"]').type('10001');

    // Check same location for dropoff
    cy.get('input[type="checkbox"]').check();

    // Confirm booking
    cy.get('[data-cy="confirm-booking-button"]').click();
    cy.waitForLoading();

    // Step 3: Payment (assuming payment component exists)
    // This would depend on the actual payment implementation
    cy.url().should('include', '/payment');

    // Fill payment details (mock data)
    cy.get('[data-cy="card-number"]').type('4111111111111111');
    cy.get('[data-cy="expiry-date"]').type('1225');
    cy.get('[data-cy="cvv"]').type('123');
    cy.get('[data-cy="cardholder-name"]').type('Test User');

    // Submit payment
    cy.get('[data-cy="pay-now-button"]').click();
    cy.waitForLoading();

    // Step 4: Confirmation
    cy.url().should('include', '/booking-confirmation');

    // Verify confirmation details
    cy.contains('Booking Confirmed').should('be.visible');
    cy.contains('Thank you for your booking').should('be.visible');

    // Check booking details are displayed
    cy.get('[data-cy="booking-reference"]').should('be.visible');
    cy.get('[data-cy="booking-total"]').should('be.visible');
  });

  it('should handle booking validation errors', () => {
    cy.visit('/browse-cars');
    cy.get('[data-cy="view-details-button"]').first().click();

    // Try to submit without required fields
    cy.get('[data-cy="confirm-booking-button"]').should('be.disabled');

    // Fill dates but missing location
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    cy.get('[data-cy="booking-start-date"]').type(tomorrow.toISOString().split('T')[0]);

    // Button should still be disabled
    cy.get('[data-cy="confirm-booking-button"]').should('be.disabled');
  });

  it('should calculate booking total correctly', () => {
    cy.visit('/browse-cars');
    cy.get('[data-cy="view-details-button"]').first().click();

    // Select dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    cy.get('[data-cy="pickup-date"]').type(tomorrow.toISOString().split('T')[0]);
    cy.get('[data-cy="return-date"]').type(threeDaysLater.toISOString().split('T')[0]);

    // Check that total is calculated (2 days)
    cy.get('[data-cy="booking-total"]').should('contain', '$'); // Assuming price per day is shown
  });

  it('should handle same location checkbox for dropoff', () => {
    cy.visit('/browse-cars');
    cy.get('[data-cy="view-details-button"]').first().click();

    // Fill pickup location
    cy.get('[data-cy="pickup-address"]').type('123 Main Street');
    cy.get('[data-cy="pickupLocation.city"]').type('New York');
    cy.get('[data-cy="pickupLocation.state"]').type('NY');
    cy.get('[data-cy="pickupLocation.zipCode"]').type('10001');

    // Check same location
    cy.get('input[type="checkbox"]').check();

    // Dropoff fields should be auto-filled
    cy.get('[data-cy="dropoffLocation.address"]').should('have.value', '123 Main Street');
    cy.get('[data-cy="dropoffLocation.city"]').should('have.value', 'New York');
  });

  it('should allow viewing booking details after creation', () => {
    // Navigate to bookings list
    cy.visit('/bookings');

    // Click on first booking
    cy.get('[data-cy="booking-item"]').first().click();

    // Should show booking details
    cy.url().should('include', '/bookings/');
    cy.contains('Booking Details').should('be.visible');
  });

  it('should handle special requests in booking', () => {
    cy.visit('/browse-cars');
    cy.get('[data-cy="view-details-button"]').first().click();

    // Fill required fields
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    cy.get('[data-cy="pickup-date"]').type(tomorrow.toISOString().split('T')[0]);
    cy.get('[data-cy="return-date"]').type(dayAfter.toISOString().split('T')[0]);
    cy.get('[data-cy="pickup-address"]').type('123 Main Street');
    cy.get('[data-cy="pickupLocation.city"]').type('New York');
    cy.get('[data-cy="pickupLocation.state"]').type('NY');
    cy.get('[data-cy="pickupLocation.zipCode"]').type('10001');

    // Add special requests
    cy.get('textarea').type('Please ensure the car is clean and has a full tank of gas.');

    // Confirm booking
    cy.get('[data-cy="confirm-booking-button"]').click();

    // Special requests should be saved (verification would depend on backend)
  });
});