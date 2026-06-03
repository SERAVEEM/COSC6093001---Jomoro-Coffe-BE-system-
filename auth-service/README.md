# Jomoro Koffee V2 — Auth Service

The **Auth Service** is the centralized identity provider and security manager of the Jomoro Koffee V2 system. Running on port `3001`, it exposes endpoints for registering new user profiles, authenticating credentials, and obtaining stateless JWT tokens that secure access across all backend microservices.

---

## Table of Contents
1. [Architectural Role](#architectural-role)
2. [Environment Configuration](#environment-configuration)
3. [Database Schema](#database-schema)
4. [No-Regex Custom Validations](#no-regex-custom-validations)
5. [API Endpoint Contract](#api-endpoint-contract)
6. [Codebase Tour](#codebase-tour)
7. [Running & Development Scripts](#running--development-scripts)

---

## Architectural Role

The Auth Service performs the following roles:
* **Central User Repository**: Connects to the isolated `jomoro_auth` MySQL database to store credential and profile details.
* **Token Authority**: Uses symmetric token signing via `@nestjs/jwt` and a shared `JWT_SECRET` key. This allows other services (`product-service` and `transaction-service`) to inspect and decode client JWTs independently and statelessly.
* **Role Management**: Assigns roles (`Admin` or `Customer`) which govern permissions downstream.

---

## Environment Configuration

Create a `.env` file in the root of the `auth-service` directory:

```env
DATABASE_URL="mysql://root:@localhost:3306/jomoro_auth"
JWT_SECRET="JomoroKoffeeV2SecretKeyForAuthService"
PORT=3001
```

* **DATABASE_URL**: The connection URL for the MySQL instance.
* **JWT_SECRET**: The private secret key used for signing JWT payloads. Must be kept identical across all services to enable verification.
* **PORT**: The network port this microservice binds to. Defaults to `3001`.

---

## Database Schema

The database model is defined via Prisma in [schema.prisma](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/auth-service/prisma/schema.prisma):

```prisma
model User {
  id         Int    @id @default(autoincrement()) @unique
  first_name String
  last_name  String
  Email      String @unique
  password   String
  role       String

  @@map("users")
}
```

### Table Properties: `users`
| Column Name | Database Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | Primary Key, Autoincrement, Unique | Unique identifier for each user. |
| `first_name` | `VARCHAR(191)` | Not Null | User's first name. |
| `last_name` | `VARCHAR(191)` | Not Null | User's last name. |
| `Email` | `VARCHAR(191)` | Unique, Not Null | Email address (used as login username). |
| `password` | `VARCHAR(191)` | Not Null | Plain text password (custom validated). |
| `role` | `VARCHAR(191)` | Not Null | Authorization level (e.g., `Admin`, `Customer`). |

---

## No-Regex Custom Validations

To safeguard the application from Regular Expression Denial of Service (ReDoS) vulnerabilities and satisfy strict system constraints, all inputs are validated programmatically using loops and character checks. The validation logic is implemented in [validation.utils.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/auth-service/src/utils/validation.utils.ts):

1. **Name Validation (`isAlpha`)**:
   * **Rule**: First and last names must contain alphabetical letters only (`A-Z`, `a-z`).
   * **Logic**: Iterates through each character, checking whether its ASCII character code falls strictly between `65-90` (uppercase) or `97-122` (lowercase).
2. **Email Extension (`isValidEmailExtension`)**:
   * **Rule**: Email must contain an `@` symbol and end with either `.com`, `.net`, `.org`, or `.id`.
   * **Logic**: Employs string containment checks (`includes('@')`) and suffix verification (`endsWith(...)`).
3. **Password Strength (`isValidPassword`)**:
   * **Rule**: Minimum 8 characters, zero spacing characters, and at least 2 numerical digits.
   * **Logic**: Evaluates length, searches for empty spaces (`includes(' ')`), and iterates character-by-character incrementing a counter whenever `char >= '0' && char <= '9'`.

---

## API Endpoint Contract

Access the visual Swagger documentation at: [http://localhost:3001/api](http://localhost:3001/api)

### 1. Register User
* **Endpoint**: `POST /auth/register`
* **Access**: Public
* **Request DTO (`RegisterDto`)**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "Password123",
    "role": "Customer"
  }
  ```
* **Responses**:
  * `201 Created`: Returns the registered user details (excluding password).
  * `400 Bad Request`: Validation checks failed.
  * `409 Conflict`: The email address is already registered.

### 2. Login User
* **Endpoint**: `POST /auth/login`
* **Access**: Public
* **Request DTO (`LoginDto`)**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "Password123"
  }
  ```
* **Responses**:
  * `200 OK`: Returns the generated access token:
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  * `401 Unauthorized`: Invalid credentials.

### 3. Get User Profile
* **Endpoint**: `GET /profiles`
* **Access**: Authenticated (Requires header: `Authorization: Bearer <token>`)
* **Responses**:
  * `200 OK`: Returns the authenticated user's profile:
    ```json
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "Email": "john.doe@example.com",
      "role": "Customer"
    }
    ```
  * `401 Unauthorized`: Token is missing or invalid.

---

## Codebase Tour

Below is a map of the file layout inside `/src` and their primary functions:

* [main.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/auth-service/src/main.ts): Configures and bootstraps the NestJS application, enables Cross-Origin Resource Sharing (CORS), sets up Swagger UI documentation, and runs the listener.
* [app.module.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/auth-service/src/app.module.ts): The root module, binding the database connector, controller, service logic, and `@nestjs/jwt` module configured with JWT settings.
* [app.controller.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/auth-service/src/app.controller.ts): Exposes the HTTP endpoints, specifies routing, and registers guards (`JwtAuthGuard`) and Swagger annotations.
* [app.service.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/auth-service/src/app.service.ts): Implements business logic (profile retrieval, plain password verification, token generation, and account insertion).
* [prisma.service.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/auth-service/src/prisma.service.ts): Handles lifecycle hook connections to the MySQL database via Prisma Client.
* [jwt.strategy.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/auth-service/src/jwt.strategy.ts): Implements the `passport-jwt` strategy, fetching the JWT token from authorization headers and decoding its contents.
* [jwt-auth.guard.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/auth-service/src/jwt-auth.guard.ts): Intercepts incoming requests to profile routes to verify authentic token authorization.
* [register.dto.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/auth-service/src/register.dto.ts): Defines the structure and Swagger properties for user registration requests.
* [login.dto.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/auth-service/src/login.dto.ts): Defines the structures for login requests.
* [utils/validation.utils.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/auth-service/src/utils/validation.utils.ts): Contains programmatic custom validation functions.

---

## Running & Development Scripts

Ensure that you run `npm install` and verify that the database table is pushed (`npx prisma db push`) before starting.

```bash
# Start compiling and run the development server with hot-reload
$ npm run start:dev

# Compile project assets into static JavaScript (/dist)
$ npm run build

# Start compiling and run the production server built files
$ npm run start:prod

# Format files using Prettier configuration rules
$ npm run format

# Run code linter
$ npm run lint
```
