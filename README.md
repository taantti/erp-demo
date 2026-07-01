# ERP Demo Backend

A modular Node.js backend for ERP-style applications, built with Express and Mongoose. Supports multi-tenancy, role-based access control and validation/sanitization.

## Features
- Modular architecture (user, product, stock, role, tenant, asset)
- Multi-tenant data isolation at model level
- Role-based authentication and authorization (JWT)
- Centralized error handling and logging
- Centralized auto-population of audit fields (createdBy, updatedBy, performedBy)
- RESTful API with Swagger/OpenAPI documentation
- JSDoc documentation throughout

## Architecture

Each module follows a consistent four-layer structure:

```
Request → Route → Controller → Service → Model → MongoDB
```

| Layer | Responsibility |
|-------|---------------|
| **Route** | Endpoint definitions, Swagger docs, authorization middleware |
| **Controller** | HTTP request/response handling, status codes, error forwarding |
| **Service** | Business logic, calls model functions, logging |
| **Model** | Mongoose schema, CRUD operations, tenant isolation, field sanitization |

### Multi-Tenancy

Every model enforces tenant isolation at the database query level:
- **Create**: `setTenantForData()` attaches the tenant ID from `req.user` to new documents.
- **Read**: `getTenantIdForQuery()` / `getTenantQueryCondition()` ensures queries are scoped to the user's tenant.
- **Update/Delete**: `findOneAndUpdate` / `findOneAndDelete` with tenant condition prevents cross-tenant access.
- **Permission check**: `checkUserTenantPermissions()` validates that the user has the required role and tenant context.

### Audit Fields

`modelService.js` provides a centralized `setAutoField()` helper with an `AutoField` enum:
- `CREATED_BY` — set on document creation
- `UPDATED_BY` — set on document update
- `PERFORMED_BY` — set on stock events (who performed the action)

### Middleware Pipeline

```
Request → helmet → JSON parser → sanitization → [/login (public)] → authentication → authorization → handler → validation error handler → error handler
```

| Middleware | Purpose |
|-----------|---------|
| `helmet` | Security headers |
| `express.json` | Body parsing |
| `sanitizationMiddleware` | Input sanitization and validation |
| `authenticationMiddleware` | JWT token verification |
| `authorizationMiddleware` | Role-based permission check per route |
| `validationErrorMiddleware` | Mongoose validation error formatting |
| `errorMiddleware` | Centralized error response with log ID |

## Project Structure

```
├── src/
│   ├── app.js                # Express app initialization and middleware pipeline
│   ├── config.js             # Environment configuration
│   ├── swagger.js            # Swagger/OpenAPI schema definitions
│   ├── models/
│   │   ├── modelService.js   # Shared model helpers (tenant, audit fields, permissions)
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   ├── productCategoryModel.js
│   │   ├── stockModel.js
│   │   ├── stockEventModel.js
│   │   ├── stockInventoryModel.js
│   │   ├── stockShelfModel.js
│   │   ├── tenantModel.js
│   │   ├── roleModel.js
│   │   ├── logModel.js
│   │   └── index.js          # Central model exports
│   ├── modules/
│   │   ├── user/
│   │   │   ├── userController.js
│   │   │   └── services/
│   │   │       └── userService.js
│   │   ├── product/
│   │   │   ├── productController.js
│   │   │   └── services/
│   │   │       ├── productService.js
│   │   │       └── categoryService.js
│   │   ├── stock/
│   │   │   ├── stockController.js
│   │   │   └── services/
│   │   │       ├── stockService.js
│   │   │       ├── eventService.js
│   │   │       ├── inventoryService.js
│   │   │       └── shelfService.js
│   │   ├── asset/
│   │   │   └── assetController.js
│   │   ├── login/
│   │   ├── role/
│   │   └── tenant/
│   ├── routes/               # Express route definitions with Swagger docs
│   ├── middlewares/          # Auth, error, sanitization, validation middleware
│   └── utils/                # Logger, sanitization, auxiliary helpers
├── .env-example
├── package.json
└── README.md
```

## API Endpoints

All protected routes require a valid JWT token in the `Authorization: Bearer <token>` header.

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/login` | Authenticate and receive JWT token |

### Users `/user`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/user` | Get all users (supports query filtering) |
| POST | `/user` | Create a new user |
| GET | `/user/:id` | Get user by ID |
| PUT | `/user/:id` | Update user |
| PUT | `/user/:id/update-password` | Update user password |
| DELETE | `/user/:id` | Delete user |

### Products `/product`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/product` | Get all products (supports query filtering) |
| POST | `/product` | Create a new product |
| GET | `/product/:id` | Get product by ID |
| PUT | `/product/:id` | Update product |
| DELETE | `/product/:id` | Delete product |
| GET | `/product/category` | Get all categories |
| POST | `/product/category` | Create a new category |
| GET | `/product/category/:id` | Get category by ID |
| PUT | `/product/category/:id` | Update category |
| DELETE | `/product/category/:id` | Delete category |

### Stock `/stock`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/stock` | Get all stocks (warehouses) |
| POST | `/stock` | Create a new stock |
| GET | `/stock/:id` | Get stock by ID |
| PUT | `/stock/:id` | Update stock |
| DELETE | `/stock/:id` | Delete stock |
| GET | `/stock/shelf` | Get all shelves |
| POST | `/stock/shelf` | Create a new shelf |
| GET | `/stock/shelf/:id` | Get shelf by ID |
| PUT | `/stock/shelf/:id` | Update shelf |
| DELETE | `/stock/shelf/:id` | Delete shelf |
| GET | `/stock/event` | Get all stock events |
| POST | `/stock/event` | Create a new stock event |
| GET | `/stock/event/:id` | Get stock event by ID |
| PUT | `/stock/event/:id` | Update stock event |
| DELETE | `/stock/event/:id` | Delete stock event |
| GET | `/stock/inventory` | Get all inventory entries |
| POST | `/stock/inventory` | Create a new inventory entry |
| GET | `/stock/inventory/:id` | Get inventory entry by ID |
| PUT | `/stock/inventory/:id` | Update inventory entry |
| DELETE | `/stock/inventory/:id` | Delete inventory entry |

### Tenants `/tenant`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/tenant` | Get all tenants |
| POST | `/tenant` | Create a new tenant |
| GET | `/tenant/:id` | Get tenant by ID |
| PUT | `/tenant/:id` | Update tenant |
| DELETE | `/tenant/:id` | Delete tenant |

### Roles `/role`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/role` | Get all roles |
| POST | `/role` | Create a new role |
| GET | `/role/:id` | Get role by ID |
| PUT | `/role/:id` | Update role |
| DELETE | `/role/:id` | Delete role |

### Assets `/asset`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/asset/roles` | Get available roles (filtered by user's role level) |
| GET | `/asset/product/units` | Get available product measurement units |
| GET | `/asset/stock/event-types` | Get available stock event types |

## API Documentation

Swagger/OpenAPI documentation is available at `/api-docs` when the server is running. All endpoints include full request/response schema definitions.

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure environment:**
   - Copy `.env-example` to `.env` and fill in your own values:
     ```sh
     cp .env-example .env
     ```
   - Edit `.env` as needed for your environment (database, JWT, etc).
3. **Run the app:**
   ```sh
   npm start
   ```

## Initial Setup ⚠️

Before first use, run the install script to create initial tenants, roles and users:

```sh
node src\scripts\init\init.js
```

This script will populate the database with required tenants and user accounts. ⚠️ Scripts are under refactoring.

## Main Libraries & Tools
- [Express](https://expressjs.com/) — web framework
- [Mongoose](https://mongoosejs.com/) — MongoDB ODM
- [bcrypt](https://www.npmjs.com/package/bcrypt) — password hashing
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) — JWT authentication
- [helmet](https://www.npmjs.com/package/helmet) — security headers
- [sanitize-html](https://www.npmjs.com/package/sanitize-html) — input sanitization
- [dotenv](https://www.npmjs.com/package/dotenv) — environment variables
- [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc) + [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) — API documentation

## Project Status ⚠️

**This project is still under development and not yet production-ready. Some features may be incomplete or unstable.**

## Tests

Integration tests using [Vitest](https://vitest.dev/) and [Supertest](https://www.npmjs.com/package/supertest).

```sh
npm test
```

Tests run against an in-memory MongoDB replica set (mongodb-memory-server) — no local MongoDB or DATABASE_URI_TEST needed.

```
tests/
├── setup/
│   ├── db.js                          # Test database connection and teardown
│   ├── mockData.js                    # Shared mock data (product, stock, user)
│   └── login.js                       # Shared login utility
└── integration/
    └── modules/
        ├── login/
        │   └── login.test.js          # Login endpoint tests
        ├── product/
        │   ├── category.test.js       # Product category CRUD endpoint tests
        │   └── product.test.js        # Product CRUD endpoint tests
        ├── stock/
        │   ├── event.test.js           # Stock event CRUD endpoint tests
        │   ├── inventory.test.js       # Stock inventory CRUD endpoint tests
        │   ├── shelf.test.js           # Stock shelf CRUD endpoint tests
        │   └── stock.test.js           # Stock CRUD endpoint tests
        └── user/
            └── user.test.js           # User CRUD endpoint tests

```

## License
MIT

