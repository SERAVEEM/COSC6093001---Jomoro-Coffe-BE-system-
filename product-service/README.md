# Jomoro Koffee V2 — Product Service

The **Product Service** manages the product catalog, coffee categories, and real-time inventory level adjustments. Running on port `3002`, it supports public browsing of the store's inventory, allows administrators to perform CRUD updates, and enables authenticated clients to adjust inventory stock levels during checkouts.

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

The Product Service manages the following functions:
* **Product Catalog Repository**: Connects to the isolated `jomoro_product` MySQL database to query, index, and organize categories and products.
* **Shared JWT Verification**: Uses the same signature credentials (`JWT_SECRET`) as the auth service. This enables stateless verification of client tokens using the Passport-JWT guard.
* **Inventory Control & Internal Orchestration**: Exposes a dedicated route `/admin/products/:id/reduce` that decrements stock when checkouts are finalized by the transaction service.

---

## Environment Configuration

Create a `.env` file in the root of the `product-service` directory:

```env
DATABASE_URL="mysql://root:@localhost:3306/jomoro_product"
JWT_SECRET="JomoroKoffeeV2SecretKeyForAuthService"
PORT=3002
```

* **DATABASE_URL**: The connection URL for the `jomoro_product` MySQL schema.
* **JWT_SECRET**: **Must match the JWT secret key of the Auth Service**. Allows local signature validation for request guards.
* **PORT**: The network port this microservice binds to. Defaults to `3002`.

---

## Database Schema

The database models are defined via Prisma in [schema.prisma](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/product-service/prisma/schema.prisma):

```prisma
model Category {
  id       Int       @id @default(autoincrement()) @unique
  name     String
  products Product[]

  @@map("categories")
}

model Product {
  id          Int      @id @default(autoincrement()) @unique
  name        String
  description String
  price       Float
  stock       Int
  image_url   String?
  category_id Int

  category Category @relation(fields: [category_id], references: [id], onDelete: Cascade)

  @@map("products")
}
```

### Table Properties: `categories`
| Column Name | Database Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | Primary Key, Autoincrement, Unique | Unique identifier for the category. |
| `name` | `VARCHAR(191)` | Not Null | Category name (e.g., "Coffee", "Accessories"). |

### Table Properties: `products`
| Column Name | Database Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | Primary Key, Autoincrement, Unique | Unique identifier for the product. |
| `name` | `VARCHAR(191)` | Not Null | Product name. |
| `description` | `VARCHAR(191)` | Not Null | Product description text. |
| `price` | `DOUBLE` | Not Null | Float price. Must be positive integer `>= 1`. |
| `stock` | `INT` | Not Null | Quantity in stock. Must be between `0` and `999`. |
| `image_url` | `VARCHAR(191)` | Nullable | Link to the product image. |
| `category_id` | `INT` | Not Null, Foreign Key | References `categories.id` (`onDelete: Cascade`). |

---

## No-Regex Custom Validations

To satisfy system security requirements and avoid Regex-based processing overheads, incoming product requests are programmatically verified in [validation.utils.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/product-service/src/utils/validation.utils.ts):

1. **Product Name (`isValidProductName`)**:
   * **Rule**: Must contain at least 3 words.
   * **Logic**: Trims leading/trailing whitespace, splits the string using spaces (`split(' ')`), and filters out empty elements. Validates that the resulting word count is `>= 3`.
2. **Product Description (`isValidProductDescription`)**:
   * **Rule**: Must contain a minimum of 20 characters.
   * **Logic**: Evaluates `description.length >= 20`.
3. **Product Price (`isValidProductPrice`)**:
   * **Rule**: Must be a valid positive integer `>= 1`.
   * **Logic**: Casts input to a number and checks `!isNaN(num) && Number.isInteger(num) && num >= 1`.
4. **Product Stock (`isValidProductStock`)**:
   * **Rule**: Must be a valid integer between `0` and `999`.
   * **Logic**: Verifies non-null inputs, casts to number, and checks `!isNaN(num) && Number.isInteger(num) && num >= 0 && num <= 999`.

---

## API Endpoint Contract

Access the visual Swagger documentation at: [http://localhost:3002/api](http://localhost:3002/api)

### 1. Public Catalog Endpoints
* **Get All Products**: `GET /products`
  * Returns list of all products in the catalog.
* **Get Product By ID**: `GET /products/:id`
  * Returns product details. Returns `404 Not Found` if the ID doesn't exist.
* **Get All Categories**: `GET /categories`
  * Returns list of all food/drink menu categories.
* **Get Products By Category**: `GET /categories/:categoryId/products`
  * Returns products matching the specified category ID.

### 2. Admin CRUD Endpoints (Guarded: `JwtAuthGuard`, `AdminGuard`)
* **Create Product**: `POST /admin/products`
  * Request Body (`CreateProductDto`):
    ```json
    {
      "name": "Jomoro Espresso Beans",
      "description": "Rich dark roast coffee beans for daily espresso.",
      "price": 125000,
      "stock": 150,
      "image_url": "https://example.com/espresso.jpg",
      "category_id": 1
    }
    ```
  * Responses: `201 Created` on success, `400 Bad Request` on validation failure, `401 Unauthorized` / `403 Forbidden` on security failure.
* **Update Product**: `POST /admin/products/:id/update`
  * Request Body: `CreateProductDto`.
  * Responses: `200 OK` on success, `404 Not Found` if product ID doesn't exist.
* **Delete Product**: `POST /admin/products/:id/delete`
  * Responses: `200 OK` on success, `404 Not Found` if product ID doesn't exist.

### 3. Inventory Stock Adjustment (Guarded: `JwtAuthGuard`)
* **Reduce Stock**: `POST /admin/products/:id/reduce`
  * **Architectural Detail**: Protected by `JwtAuthGuard` but **not** `AdminGuard`. This allows the **Transaction Service** to execute stock reductions on behalf of customers checkout transactions.
  * Request Body (`ReduceStockDto`):
    ```json
    {
      "quantity": 2
    }
    ```
  * Responses:
    * `200 OK`: Stock reduced successfully.
    * `400 Bad Request`: Insufficient stock or invalid quantity.

---

## Codebase Tour

Below is a map of the file layout inside `/src` and their primary functions:

* [main.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/product-service/src/main.ts): Configures CORS, initializes Swagger UI documentation, and launches the application port listener.
* [app.module.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/product-service/src/app.module.ts): The root module, binding database connectors, controllers, service functions, and JWT Passport strategies.
* [app.controller.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/product-service/src/app.controller.ts): Routes incoming requests. Implements path endpoints and maps guards (`AdminGuard`, `JwtAuthGuard`).
* [app.service.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/product-service/src/app.service.ts): Orchestrates operations including product listings, validations, updates, category matches, and stock reduction queries.
* [prisma.service.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/product-service/src/prisma.service.ts): Manages connections to the database using Prisma.
* [admin.guard.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/product-service/src/admin.guard.ts): Restricts administration endpoints to users with the `Admin` role in their decrypted token payload.
* [jwt.strategy.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/product-service/src/jwt.strategy.ts): Decrypts authentication headers using the shared `JWT_SECRET` key to verify login sessions.
* [jwt-auth.guard.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/product-service/src/jwt-auth.guard.ts): Restricts routes to authenticated sessions.
* [product.dto.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/product-service/src/product.dto.ts): Defines types and validation schemas for product creation, modification, and inventory reduction inputs.
* [utils/validation.utils.ts](file:///d:/Finpro%20lab%20SA/be-system-jomoro-coffe/product-service/src/utils/validation.utils.ts): Custom validators for fields including names, descriptions, prices, and stock boundaries.

---

## Running & Development Scripts

Ensure you run `npm install` and verify the database schema is pushed (`npx prisma db push`) before starting.

```bash
# Run compiling development server with hot-reload
$ npm run start:dev

# Build files into statically optimized build outputs (/dist)
$ npm run build

# Start production server compiled output
$ npm run start:prod

# Format source files using Prettier standards
$ npm run format

# Run ESLint linter check
$ npm run lint
```
