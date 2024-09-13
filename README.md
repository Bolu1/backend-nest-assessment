# Backend Nest Assessment

A comprehensive guide to set up, run, and test the `backend-nest-assessment` application, which is built using NestJS, Prisma, and GraphQL.

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Without Docker](#without-docker)
  - [With Docker](#with-docker)
- [Environment Setup](#environment-setup)
- [Running Migrations](#running-migrations)
- [Running Tests](#running-tests)
- [GraphQL Queries](#graphql-queries)
  - [Register User](#register-user)
  - [Login User](#login-user)
  - [Biometric Login](#biometric-login)

## Project Overview

This project is a NestJS application using GraphQL and Prisma ORM to interact with a PostgreSQL database. The application allows for user registration, login, and biometric login, using JWT for authentication.

## Prerequisites

Before starting the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/) (if running without Docker)
- [Prisma CLI](https://www.prisma.io/docs/getting-started) (for migrations)

## Folder Structure

The `backend-nest-assessment` project follows a modular structure to keep the codebase organized and scalable.

```
├── prisma                   # Prisma related files
│   ├── migrations           # Migration files
│   └── schema.prisma        # Prisma schema file
├── src
│   ├── modules              # Contains the main modules of the application
│   │   ├── auth             # Authentication related files
│   │   └── user             # User related modules and services
│   ├── common               # Common modules such as guards, filters, decorators
│   ├── prisma               # Prisma service to handle database interactions
│   ├── utils                # Helper utilities for encryption, security, etc.
│   ├── config               # Configuration settings (like environment variables)
│   ├── app.module.ts        # Main module of the application
│   └── main.ts              # Entry point of the application
├── test                     # End-to-end (E2E) test files
├── .env.example             # Example of environment variables
├── docker-compose.yml       # Docker Compose setup
├── Dockerfile               # Dockerfile to build the application
├── package.json             # Project dependencies and scripts
└── README.md                # Documentation file
```

### Key Folders:

- **modules**: This contains the core application logic for authentication (`auth`) and user management (`user`).
- **prisma**: Contains all the Prisma-related configuration and migration files.
- **utils**: General utility functions like encryption, hashing, etc.
- **config**: Stores configuration files to manage environment variables, JWT, and other settings.

## Getting Started

Graphql documentation documentation can be accessed at `http://localhost:<SERVER_PORT>/graphql`

### Without Docker

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/bolu1/backend-nest-assessment.git
   cd backend-nest-assessment
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Setup Environment Variables**:

   - Rename `.env.example` to `.env`:

     ```bash
     mv .env.example .env
     ```

   - Edit the `.env` file with your own values, particularly the database connection URL (`DATABASE_URL`).

4. **Start the PostgreSQL Database** (Skip if using Docker):

   Make sure PostgreSQL is running locally, or use a cloud PostgreSQL instance. Update your `.env` file accordingly.

5. **Run Migrations**:

   Run the following command to apply the Prisma migrations:

   ```bash
   npx prisma migrate dev
   ```

6. **Start the Application**:

   ```bash
   npm run start:dev
   ```

   The application will start on the port specified in `.env`.

### With Docker

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/bolu1/backend-nest-assessment.git
   cd backend-nest-assessment
   ```

2. **Setup Environment Variables**:

   - Rename `.env.example` to `.env`:

     ```bash
     mv .env.example .env
     ```

   - Edit the `.env` file with your own values if necessary.

3. **Start the Application and Database**:

   Use Docker Compose to start the entire application:

   ```bash
   docker-compose up --build
   ```

   This will build the application and spin up both the `nestjs-app` and `postgres` containers.

4. **Access the Application**:

   - The application will be available at `http://localhost:<SERVER_PORT>` (the port defined in `.env`).

5. **Access the Documentation**:

   - The graphql documentation will be available at `http://localhost:<SERVER_PORT>/graphql` (the port defined in `.env`).

6. **Running Migrations** (Docker):

   Migrations can be run automatically during the Docker build process or manually with:

   ```bash
   docker-compose exec nestjs-app npx prisma migrate dev
   ```

## Environment Setup

The `.env.example` file contains the following environment variables:

```ini
# Server
SERVER_ENVIRONMENT=DEVELOPMENT
SERVER_PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres13240!@postgres:5432/demo_db
DATABASE_HOST=localhost
DATABASE_PASSWORD=postgres13240!
DATABASE_USER=postgres
DATABASE_DB=demo_db
DATABASE_PORT=5432

# JWT
JWT_SECRET=right_on
JWT_AUTH_TOKEN_DURATION=1d

# Bcrypt
BCRYPT_HASHING_SALT=10

# Encryption
ENCRYPTION_SALT=stick
ENCRYPTION_SECRET_KEY=give_it_up
ENCRYPTION_ALGORITHM=aes-256-cbc
```

Rename the file from `.env.example` to `.env`:

```bash
mv .env.example .env
```

## Running Migrations

After setting up your `.env` file, apply the Prisma migrations:

```bash
npx prisma migrate dev
```

If using Docker, run:

```bash
docker-compose exec nestjs-app npx prisma migrate dev
```

## Running Tests

### Unit and Integration Tests

To run unit and integration tests:

```bash
npm run test
```

### End-to-End Tests

To run end-to-end (E2E) tests:

```bash
npm run test:e2e
```

For Docker:

```bash
docker-compose exec nestjs-app npm run test:e2e
```

## GraphQL Queries

### Register User

```graphql
mutation Register {
  register(
    input: {
      email: "test@test.com"
      password: "password"
      biometricKey: "x#jhd37suweh3c39"
    }
  ) {
    accessToken
  }
}
```

### Login User

```graphql
mutation Login {
  login(input: { email: "test@test.com", password: "password" }) {
    accessToken
  }
}
```

### Biometric Login

```graphql
mutation BiometricLogin {
  biometricLogin(input: { biometricKey: "testBiometricKey" }) {
    accessToken
  }
}
```
