describe('Create Tasks', () => {
    const tasks = ['test task 1', 'test task 2', 'test task 3', 'test task 4'];

    it('should allow a user to create multi lists', () => {
      cy.visit('/dashboard/17'); // Visit the dashboard page
      cy.contains('.list-item span', 'test list 1').click();
      cy.wait(2000);
      cy.url().should('include', '/list/5283b1f5-f1dc-4985-9478-6e398d2fbeba');
  
      tasks.forEach((taskName) => {
        // Click on the "Create New Task" button
        cy.contains('button', 'Create New Task').click();
  
        // Ensure the create task input is visible and type the task name
        cy.get('input[placeholder="Task Name"]').type(taskName);
        cy.get('.ct-content').contains('button', 'Create').click({ force: true });   // Submit the create list form
        cy.wait(1000); // Wait for 1 second (1000 milliseconds)
      });
  
      // Confirm the new lists are created by checking the task items
      tasks.forEach((taskName) => {
        cy.contains('.si-item span', taskName).should('exist');
      });
    });
});