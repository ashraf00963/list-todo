describe('Reorder Tasks', () => {
    it('should move all tasks from "To Do" to "In Progress"', () => {
      cy.visit('/dashboard/17'); // Visit the dashboard page
      cy.contains('.list-item span', 'test list 1').click();
      cy.wait(2000); // Wait for the list page to load
  
      // Ensure that the "To Do" and "In Progress" containers are visible
      cy.contains('h2', 'To Do').should('be.visible');
      cy.contains('h2', 'In Progress').should('be.visible');
  
      // Get the "To Do" container
      cy.contains('h2', 'To Do').parent().as('toDoContainer').then(($toDoContainer) => {
        cy.log('To Do Container:', $toDoContainer.html());
      });
  
      // Get the "In Progress" container
      cy.contains('h2', 'In Progress').parent().as('inProgressContainer').then(($inProgressContainer) => {
        cy.log('In Progress Container:', $inProgressContainer.html());
      });
  
      // Get all tasks in the "To Do" list
      cy.get('@toDoContainer').within(() => {
        cy.get('.si-item').then($todoTasks => {
          const totalTasks = $todoTasks.length;
  
          cy.log(`Found ${totalTasks} tasks in "To Do" list`);
  
          // Move each task from "To Do" to "In Progress"
          cy.wrap($todoTasks).each(($task, index) => {
            const dataTransfer = new DataTransfer();
            cy.wrap($task)
              .trigger('mousedown', { which: 1 })
              .trigger('mousemove', { clientX: 10, clientY: 10 })
              .trigger('mousemove', { clientX: 30, clientY: 30 })
              .trigger('dragstart', { dataTransfer })
              .trigger('drag', { dataTransfer });
  
            cy.get('@inProgressContainer')
              .trigger('dragover', { dataTransfer })
              .trigger('mousemove', { clientX: 30, clientY: 30 })
              .trigger('drop', { dataTransfer });
  
            cy.wrap($task).trigger('mouseup', { force: true });
  
            cy.wait(1000); // Wait for the reorder to complete before moving the next task
          });
  
          // Confirm all tasks have been moved to "In Progress"
          cy.get('@inProgressContainer').within(() => {
            cy.get('.si-item').should('have.length', totalTasks);
          });
        });
      });
    });
  });
  