describe('User login and To-Do list operations', () => {
    it('should allow a user to login and navigate to the dashboard', () => {
      cy.visit('/'); // Visit the home page
  
      // Click on the "Login" button based on its text
      cy.contains('button', 'Login').click();
  
      // Ensure the login popup is visible
      cy.get('h2').contains('Login').should('be.visible');
  
      // Fill in the login form
      cy.get('input[name="username"]').type('testuser12355');
      cy.get('input[name="password"]').type('Password.123');
      cy.get('button[type="submit"]').click();
  
      // Check URL to ensure successful login
      cy.url().should('include', '/dashboard/17');
  
      // Click on the list named "testing" to navigate to the specific to-do list
      cy.contains('.list-item span', 'testing').click();
      cy.wait(2000); // Wait for 1 second (1000 milliseconds)

      // Ensure we are on the correct to-do list page
      cy.url().should('include', '/list/211e907e-982b-4e2e-9ff2-4405030030dd');
  
      // Click on the "Create New" button
      cy.contains('Create New').click();
  
      // Fill in the new task form
      cy.get('input[placeholder="Task Name"]').type('test task');
      cy.get('textarea[placeholder="Notes Here"]').type('testing notes here 123...');
  
      // Submit the form to create the task
      cy.contains('button', 'Create').click({ force: true });
  
      // Confirm the new task is created and visible
      cy.contains('h2', 'Todo').should('be.visible');
      cy.contains('span', 'test task').should('be.visible');
  
      // Confirm the task exists and open it
      cy.contains('span', 'test task').click();
  
      // Click on the delete button of the specific task
      cy.get('[data-cy="delete-task-button"]').click({ force: true });
  
      // Confirm the task is deleted
      cy.get('span').contains('test task').should('not.exist');
    });
  });
  