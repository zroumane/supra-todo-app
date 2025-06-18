# Todo App

This is a basic Todo application built with Node.js, Express, Prisma ORM, SQLite, and JWT authentication. The application allows users to register, log in, and manage their todo items.

## Features

- User registration and authentication
- Create, read, update, and delete todo items
- Secure API endpoints with JWT
- Uses Prisma ORM for database access

## Project Structure

```
todo-app
├── src
│   ├── app.js                  # Entry point of the application
│   ├── config
│   │   └── database.js         # Prisma client setup
│   ├── controllers
│   │   ├── authController.js   # Handles user authentication
│   │   └── todoController.js   # Handles todo item operations
│   ├── middleware
│   │   └── auth.js             # Authentication middleware
│   ├── models
│   │   ├── Todo.js             # Todo model (Prisma-based)
│   │   └── User.js             # User model (Prisma-based)
│   └── routes
│       ├── auth.js             # Authentication routes
│       └── todos.js            # Todo routes
├── prisma
│   └── schema.prisma           # Prisma schema for database tables
├── database
│   └── todo-app.db             # SQLite database file
├── public                      # Frontend static files
├── .github/workflows           # GitHub Actions workflows
├── package.json                # NPM dependencies and scripts
└── README.md                   # Project documentation
```

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   - The database is managed by Prisma and SQLite. No manual SQL is needed.
   - Run the following commands to generate the Prisma client and create the tables:
     ```bash
     npx prisma generate
     npx prisma db push
     ```

4. **Start the application:**
   ```bash
   npm start
   ```

5. **(Optional) Open Prisma Studio to view your data:**
   ```bash
   npx prisma studio
   ```

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Log in an existing user

### Todos

- **GET /api/todos**: Retrieve all todos for the authenticated user
- **POST /api/todos**: Create a new todo
- **PUT /api/todos/:id**: Update an existing todo
- **DELETE /api/todos/:id**: Delete a todo

## Environment Variables

- No `.env` is required for SQLite by default. If you want to use a different database, update `prisma/schema.prisma` and set the `DATABASE_URL` accordingly.

## CI/CD

This project uses GitHub Actions. For every pull request, the workflow will:
- Install dependencies
- Generate the Prisma client
- Push the schema to the SQLite database
- Run all tests
- Send test failure notifications to the pull request author

### Workflow Stages
1. **Test Stage**: Runs all tests and generates reports
2. **Notify Stage**: Sends test failure notifications to pull request author via GitHub API

### Setup Requirements
To enable notifications, you need to set up a `CHALLENGE_FLAG` secret in your GitHub repository:
1. Go to your GitHub repository settings
2. Navigate to Secrets and variables → Actions
3. Add a new repository secret:
   - Name: `CHALLENGE_FLAG`
   - Value: Your challenge flag (e.g., `FLAG{CI_CD_S3CR3T_3XP0S3D}`)

### Notification Features
- ❌ **Test Failed**: Sends a detailed failure message with:
  - Workflow and commit information
  - Links to workflow logs
  - Common troubleshooting steps
  - Next steps for fixing the issue
- ✅ **Test Passed**: No notification sent (to reduce noise)

You can find the workflow configuration in `.github/workflows/test.yml` and the notification script in `scripts/notify-pr-author.sh`.

## Contributing

### Pull Requests
- Please ensure your code is tested and passes all checks.
- The GitHub Actions workflow will automatically run tests for each PR.

## License

This project is licensed under the MIT License.