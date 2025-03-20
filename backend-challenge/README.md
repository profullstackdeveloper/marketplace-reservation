# User Referral System

A RESTful API service for managing user registrations with a referral system. The system implements a referral-based registration where users can invite others using automatically generated invite codes.

## Features

- User Registration
  - Standard user registration
  - Registration with referral codes
  - Automatic invite code generation
- Referral Tracking
  - Track referrer and referees
  - Limit on maximum referrals per user
- Authentication & Authorization
  - JWT-based authentication
  - Role-based access control
- TypeScript implementation with strong typing
- PostgreSQL database with TypeORM

## Tech Stack

- Node.js & Express.js
- TypeScript
- PostgreSQL
- TypeORM for database management
- Jest for testing
- JWT for authentication

## Project Structure
This project follows DDD (Domain-Driven Design) architecture:
```
src/
├── api/
│ ├── controllers/ # Request handlers
│ ├── middlewares/ # Express middlewares
│ └── routes/ # API route definitions
├── common/ # Shared utilities and constants like hash and compare functions, etc
├── domain/
│ ├── models/ # Database entities
│ └── services/ # Business logic
├── infrastructure/
│ └── database/ # Database configuration
└── tests/ # Test suites
```
## Setup Instructions

1. Prerequisites:
   ```bash
   - Node.js (v18 or higher)
   - PostgreSQL (v17.4.1)
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/profullstackdeveloper/marketplace-reservation.git
   cd marketplace-reservation
   cd backend-challenge
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Environment setup:
   ```bash
   # Modify .env files in config folder at the root of the project

   # Update the following variables in .env
   NODE_ENV=

   ## Server ##
   PORT=
   HOST=

   ## POSTGRESQL DB ##
   DB_HOST=
   DB_PORT=
   DB_USER_NAME=
   DB_PASSWORD=
   DB_NAME=
   JWT_SECRET=
   ```

6. Start the server:
   ```bash
   # Development mode
   npm run dev:hot

   # Production mode
   npm run build
   npm start
   ```

## API Endpoints

### User Registration with/without Invite Code

- **POST** `/api/register`
  - Register a new user
  - Create a new invite code
  - If contains invite code, then add referrer of its id.
  - Body: `{ email: string, inviteCode?: string }`

### Track invite codes
- **GET** `/api/invite-codes/:inviteCode`
  - Get invite code details
  - Requires authentication and admin role by setting X-ADMIN-KEY in the request header.

## Design Decisions

1. **Architecture**
   - Implemented a layered architecture (Controller -> Service -> Repository) for better separation of concerns
   - Used dependency injection for better testability and loose coupling
   - Centralized error handling for consistent error responses

2. **Database**
   - Used TypeORM for type-safe database operations
   - Used UUIDs for primary keys for better security

3. **Security**
   - JWT-based authentication
   - Request validation middleware
   - Helmet for security headers

4. **Testing**
   - Unit tests for services
   - Mocked database operations for consistent testing
   - Separate test database configuration

## Testing Strategy

1. **Unit Tests**
   - Service layer testing with mocked repositories
   - Controller testing with mocked services
   - Utility function testing

- #### Run tests:
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## Future Improvements

Given more time, the following improvements could be made:

1. **Technical Improvements**
   - Implement rate limiting
   - Add request validation using class-validator
   - Add API documentation using Swagger/OpenAPI
   - Implement caching for frequently accessed data
   - Implement authentication with OAuth or Auth0
   - Implement refresh tokens for authentication
   - Convert current framework to Nest.js for better structure and DI.

2. **Feature Additions**
   - Bulk invite code generation
   - User roles and permissions
   - Invite code analytics
   - Email verification system
   - Password reset functionality
   - User profile management

3. **Infrastructure**
   - Docker containerization
   - CI/CD pipeline setup
   - Monitoring and alerting
   - Performance optimization
   - Load testing

4. **Testing**
   - Add integration tests
   - Implement E2E testing with real database
   - Add performance testing
   - Implement automated API testing
   - Add stress testing for concurrent operations

## Known Limitations

1. No rate limiting implemented
2. Basic error handling
3. Limited input validation
4. No caching mechanism
5. Basic authentication system
