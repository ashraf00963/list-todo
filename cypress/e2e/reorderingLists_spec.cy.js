describe('Reorder Lists', () => {
    it('should allow a user to reorder lists', () => {
      cy.visit('/dashboard/17'); // Visit the dashboard page
  
      // Ensure there are at least 4 list items
      cy.get('.list-item').should('have.length.greaterThan', 3);
  
      // Get the text of the fourth list item (index 3) before reordering
      cy.get('.list-item').eq(3).find('span').invoke('text').then((lastItemText) => {
  
        // Perform the drag-and-drop operation using indexes
        cy.get('.list-item').eq(3) // Fourth list item (index 3)
          .find('[data-cy="drag-handle"]')
          .should('be.visible')
          .realMouseDown();
  
        cy.get('.list-item').eq(0) // First list item (index 0)
          .find('[data-cy="drag-handle"]')
          .should('be.visible')
          .realMouseMove(0, 10)
          .realMouseUp();
  
        // Wait for the reorder to complete
        cy.wait(1000);
  
        // Confirm the lists have been reordered
        cy.get('.list-item').eq(0).find('span').should(($span) => {
          expect($span.text()).to.equal(lastItemText);
        });
      });
    });
  });
  