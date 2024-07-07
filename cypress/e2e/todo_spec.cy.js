// cypress/e2e/todo_spec.cy.js

describe('To-Do Application', () => {
  it('should load the homepage', () => {
    cy.visit('/'); // Adjust the path based on your routing
    cy.contains('Dashboard'); // Adjust the text based on what you expect to find on the homepage
  });

  it('should navigate to the login page', () => {
    cy.visit('/');
    cy.contains('Login').click(); // Adjust based on the actual login button text
    cy.url().should('include', '/login'); // Adjust based on the actual login page URL
  });

  it('should allow a user to login', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('testuser'); // Adjust based on your actual input fields
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should create a new task', () => {
    cy.visit('/dashboard');
    cy.contains('Create New List').click(); // Adjust based on the actual button text
    cy.get('input[placeholder="List Name"]').type('Test List');
    cy.get('button').contains('Add').click();
    cy.contains('Test List').click(); // Adjust based on navigation to the new list

    cy.contains('Create New Task').click(); // Adjust based on the actual button text
    cy.get('input[placeholder="Task Name"]').type('Test Task');
    cy.get('textarea[placeholder="Notes Here"]').type('This is a test task.');
    cy.get('button').contains('Create').click();
    cy.contains('Test Task');
  });
});
