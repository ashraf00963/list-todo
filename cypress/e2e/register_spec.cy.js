// cypress/e2e/register_spec.cy.js

describe('User Registration', () => {
    it('should allow a user to register and open the login popup', () => {
      cy.visit('/'); // Visit the home page
  
      // Click on the "Join Now" button based on its text
      cy.contains('button', 'Join Now').click();
  
      // Ensure the registration popup is visible
      cy.get('h2').contains('Register').should('be.visible');
  
      // Fill in the registration form
      cy.get('input[name="username"]').type('testuser12355');
      cy.get('input[name="password"]').type('Password.123');
      cy.get('input[name="confirmPassword"]').type('Password.123');
      cy.get('button[type="submit"]').click();
      
      // Intercept the alert
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Registered successfully');
      });
  
      // Submit the registration form
      cy.get('button[type="submit"]').click();
      
      // Verify that the registration popup is closed
      cy.get('h2').contains('Register').should('not.exist');
  
      // Ensure the login popup is visible
      cy.get('h2').contains('Login').should('be.visible');
    });
  });
  