
describe('User login', () => {
    it('should allow a user to register and open the login popup', () => {
      cy.visit('/'); // Visit the home page
  
      // Click on the "Join Now" button based on its text
      cy.contains('button', 'Login').click();
  
      // Ensure the registration popup is visible
      cy.get('h2').contains('Login').should('be.visible');
  
      // Fill in the registration form
      cy.get('input[name="username"]').type('testuser12355');
      cy.get('input[name="password"]').type('Password.123');

      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/dashboard/17');

    });
  });
  