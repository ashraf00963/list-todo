describe('Dashboard List Management', () => {
    it('should allow a user to create and delete a list', () => {
      cy.visit('/dashboard/17'); // Visit the dashboard page
  
      // Click on the "Create New List" button
      cy.contains('button', 'Create New List').click();
  
      // Ensure the create list input is visible and type the list name
      cy.get('input[placeholder="List Name"]').type('test list');
  
      // Submit the create list form
      cy.get('button').contains('Add').click();
  
      // Confirm the new list is created by checking the list item
      cy.contains('.list-item span', 'test list').should('exist');
  
      // Debug: Log the current lists
      cy.get('.lists-container').then(($container) => {
        console.log('Lists after creation:', $container.html());
      });
  
      // Wait for the list to be fully loaded and visible
      cy.wait(1000);
  
      // Hover over the created list item to reveal the delete button
      cy.contains('.list-item span', 'test list').trigger('mouseover');
  
      // Click on the delete button (assumes it has a class 'delete-icon')
      cy.contains('.list-item span', 'test list').parent().find('.delete-icon').click();
  
      // Confirm the delete popup is visible
      cy.contains('h3', 'Are you sure you want to delete this list?').should('be.visible');
  
      // Click on the "Yes" button to confirm deletion
      cy.contains('button', 'Yes').click();
  
      // Debug: Log the current lists
      cy.get('.lists-container').then(($container) => {
        console.log('Lists after deletion:', $container.html());
      });
  
      // Confirm the list is deleted by checking the list item no longer exists
      cy.contains('.list-item span', 'test list').should('not.exist');
    });
  });
  