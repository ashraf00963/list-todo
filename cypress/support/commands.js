// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import '@4tw/cypress-drag-drop';
import 'cypress-real-events/support';

Cypress.Commands.add('dragTo', { prevSubject: 'element' }, (subject, targetEl) => {
  const dataTransfer = new DataTransfer();

  cy.wrap(subject)
    .trigger('mousedown', { which: 1, button: 0 })
    .trigger('mousemove', { clientX: 10, clientY: 10 }) // Initial move to start dragging
    .trigger('mousemove', { clientX: 30, clientY: 30, dataTransfer }) // Move by at least 20px to trigger move
    .trigger('dragstart', { dataTransfer })
    .trigger('drag', { dataTransfer });

  cy.get(targetEl)
    .trigger('dragover', { dataTransfer })
    .trigger('mousemove', { clientX: 30, clientY: 30, dataTransfer }) // Ensure move by at least 20px
    .trigger('drop', { dataTransfer });

  cy.wrap(subject).trigger('mouseup', { force: true });
});
