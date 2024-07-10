describe('Create Lists', () => {
    const lists = ['test list 1', 'test list 2', 'test list 3', 'test list 4'];
  
    it('should allow a user to create multi lists', () => {
      cy.visit('/dashboard/17'); // Visit the dashboard page
  
      lists.forEach((listName) => {
        // Click on the "Create New List" button
        cy.contains('button', 'Create New List').click();
  
        // Ensure the create list input is visible and type the list name
        cy.get('input[placeholder="List Name"]').type(listName);
        cy.get('button').contains('Add').click();   // Submit the create list form
        cy.wait(1000); // Wait for 1 second (1000 milliseconds)
      });
  
      // Confirm the new lists are created by checking the list items
      lists.forEach((listName) => {
        cy.contains('.list-item span', listName).should('exist');
      });
    });
});
  