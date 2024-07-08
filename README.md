<img src="src/assets/logo-to-do.png" alt="List To Do Logo" width="200">

# List To-Do

## Overview
List To-Do is a user-friendly task management application designed to help users organize their tasks and lists efficiently. Built with a modern tech stack, it offers features like task creation, list management, attachment uploads, and more.

## Features
- **User Registration and Login**: Secure authentication to manage personal lists and tasks.
- **Task Management**: Create, update, and delete tasks within lists.
- **List Management**: Create and delete lists.
- **Attachments**: Upload and manage attachments for tasks.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack
- **Frontend**: React.js, Redux, React Router, DnD Kit
- **Backend**: PHP
- **Database**: MySQL
- **Styling**: CSS, Bootstrap
- **Build Tools**: Vite
- **Testing**: Cypress for end-to-end testing

## Installation

### Prerequisites
- Node.js and npm
- PHP and MySQL

### Backend Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/ashraf00963/list-todo.git
    ```
2. Navigate to the project directory:
    ```bash
    cd list-todo
    ```
3. Setup the database:
    - Import the provided SQL file into your MySQL database.
    - Update the database configuration in `db.php`.

4. Start the PHP server:
    ```bash
    php -S localhost:8000
    ```

### Frontend Setup
1. Navigate to the frontend directory:
    ```bash
    cd todo-app
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```

## Running Tests
1. Start the Cypress test runner:
    ```bash
    npx cypress open
    ```
2. Run the desired test specifications.

## Usage
- **Register a new account**: Click on "Join Now" on the home page.
- **Login**: Use your credentials to login.
- **Create a new list**: Navigate to the dashboard and click "Create New List".
- **Add a task**: Open a list and click "Create New Task".
- **Upload an attachment**: Edit a task and use the attachment upload feature.
- **Delete a task or list**: Use the delete buttons provided in the UI.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request for any improvements or fixes.

## License
This project is licensed under the MIT License.

## Contact
For any questions or suggestions, please contact [ashraf00963](https://github.com/ashraf00963).

