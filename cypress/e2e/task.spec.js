// cypress/e2e/task.spec.js

describe('Task Management', () => {
    it('should register a new user', () => {
      cy.visit('/');
      cy.contains('Register').click();
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('Password123!');
      cy.get('input[name="confirmPassword"]').type('Password123!');
      cy.get('button').contains('Register').click();
      cy.contains('Login');
    });
  
    it('should login an existing user', () => {
      cy.visit('/');
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('Password123!');
      cy.get('button').contains('Login').click();
      cy.contains('Dashboard');
    });
  
    it('should create a new list', () => {
      cy.visit('/dashboard/testuser');
      cy.get('button').contains('Create New List').click();
      cy.get('input[placeholder="List Name"]').type('Test List');
      cy.get('button').contains('Add').click();
      cy.contains('Test List');
    });
  
    it('should create a new task', () => {
      cy.visit('/dashboard/testuser');
      cy.contains('Test List').click();
      cy.get('button').contains('Create New Task').click();
      cy.get('input[placeholder="Task Name"]').type('Test Task');
      cy.get('button').contains('Create').click();
      cy.contains('Test Task');
    });
  
    it('should upload an attachment', () => {
      cy.visit('/dashboard/testuser');
      cy.contains('Test List').click();
      cy.contains('Test Task').click();
      cy.contains('Edit').click();
      cy.get('input[type="file"]').attachFile('path/to/file.pdf');
      cy.get('button').contains('Upload Attachment').click();
      cy.contains('file.pdf');
    });
  
    it('should delete a task', () => {
      cy.visit('/dashboard/testuser');
      cy.contains('Test List').click();
      cy.contains('Test Task').click();
      cy.contains('Delete').click();
      cy.contains('Test Task').should('not.exist');
    });
  });
  