# ERP Demo Backend

A modular Node.js backend for ERP-style applications, built with Express and Mongoose. Supports multi-tenancy, role-based access control and validation/sanitization.

## Features
- Modular architecture (user, product, role, tenant, etc.)
- Multi-tenant support
- Role-based authentication and authorization (JWT)
- Deep request validation and sanitization
- Centralized error handling and logging
- RESTful API structure
- JSDoc documentation

## Project Structure

```
├── src/
│   ├── app.js                # Main Express app
│   ├── config.js             # Configuration
│   ├── models/               # Mongoose models (userModel.js, productModel.js, ...)
│   ├── modules/              # Business logic modules
│   │   ├── user/
│   │   │   ├── userController.js
│   │   │   └── services/
│   │   │       └── userService.js
│   │   ├── product/
│   │   │   ├── productController.js
│   │   │   └── services/
│   │   │       ├── productService.js
│   │   │       └── categoryService.js
│   │   └── ...
│   ├── routes/               # Express route definitions
│   ├── middlewares/          # Custom middleware (auth, error, sanitization, ...)
│   └── utils/                # Utility functions (logger, auxiliary, ...)
├── package.json
├── README.md
└── ...
```

## Main Libraries & Tools
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [bcrypt](https://www.npmjs.com/package/bcrypt) (password hashing)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) (JWT auth)
- [helmet](https://www.npmjs.com/package/helmet) (security headers)
- [JSDoc](https://jsdoc.app/) (documentation)

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure environment:**
   - Edit `src/config.js` and set database, JWT, and other settings.
3. **Run the app:**
   ```sh
   npm start
   ```

## Environment Variables

- Copy `.env-example` to `.env` and fill in your own values:
  ```sh
  cp .env-example .env
  ```
- Edit `.env` as needed for your environment (database, JWT, etc).

## API Overview
- All endpoints are under `/user`, `/product`, `/role`, `/tenant`, etc.
- JWT authentication required for protected routes.
- See `src/routes/` and controller files for details.

## API Documentation

Initial Swagger/OpenAPI documentation is available at `/api-docs` when the server is running.
More endpoints and documentation will be added in future updates.

## Initial Setup: Create Tenants and Users. ⚠️ All scripts are under refactoring. 

Before first use, run the install script to create initial tenants and users:

```sh
node src\scripts\init\init.js
```

This script will populate the database with required tenants and user accounts.

## Development Notes
- Modular service/controller/model structure for easy extension
- Centralized logger with log levels and file output
- All models and services documented with JSDoc
- Multi-tenant and role-based access logic in all CRUD operations

## Project Status ⚠️

**This project is still under development and not yet production-ready. Some features may be incomplete or unstable.**

## Tests

Unit and integration test will be added in future updates.

## License
MIT

