# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`erp-demo` is a modular Node.js/Express + Mongoose backend for a multi-tenant ERP. Pure ESM (`"type": "module"` — use `import`, not `require`). Still under development, not production-ready. The frontend lives in the separate `erp-demo-frontend` working directory.

## Commands

```sh
npm start              # Run the server (src/server.js); connects to MongoDB then listens on config.PORT
npm test               # Run all Vitest integration tests (serial — see below)
npm run init           # Seed initial tenants/roles/users (src/scripts/init/init.js — under refactoring)
```

Run a single test file or test by name:

```sh
npx vitest run tests/integration/modules/product/product.test.js
npx vitest run -t "should create new product"
```

`npm test` runs with `--fileParallelism=false` (serial). This is required: tests share a single MongoDB test database and `teardown()` drops it in `afterAll`, so parallel files would clobber each other. Keep new test files serial-safe.

Tests need a reachable Mongo instance via `DATABASE_URI_TEST` in `.env` (separate from the dev DB — it gets dropped). Copy `.env-example` to `.env` for local config. `npm run build` is a no-op placeholder.

## Architecture

Every domain module flows through four layers. Match this when adding features:

```
Request → Route → Controller → Service → Model → MongoDB
```

- **Route** (`src/routes/*Routes.js`) — endpoint + Swagger JSDoc + per-route `authorizationMiddleware(module, feature)`. Routes are aggregated in `src/routes/index.js` and mounted in `src/app.js`.
- **Controller** (`src/modules/<domain>/<domain>Controller.js`) — owns HTTP: reads `req`, calls the service, sets status codes (200/201/400/404), forwards errors with `next(error)`. No business logic.
- **Service** (`src/modules/<domain>/services/*Service.js`) — calls model functions, returns plain data to the controller. Note the unusual signature: services are called as `service.fn(req, res, next)` and themselves call `next(error)` on failure rather than rethrowing.
- **Model** (`src/models/*Model.js`) — Mongoose schema **plus** exported CRUD functions (e.g. `createProduct`, `findProducts`). This is where tenant isolation, audit fields, and sanitization are enforced — not in the service.

`src/models/index.js` re-exports all model CRUD functions; import from there. Each module's services have an `index.js` barrel too.

### Multi-tenancy (enforced in the model layer)

All tenant scoping comes from `src/models/modelService.js`. Every model CRUD function:
1. Calls `checkUserTenantPermissions(req, allTenants, context)` first — throws `"Permission denied"` and logs `CRITICAL` if the user lacks tenant/role context.
2. On **create**: `setTenantForData()` stamps `req.user.tenant.id` onto the document.
3. On **read**: `getTenantIdForQuery()` / `getTenantQueryCondition()` scope the query to the user's tenant.
4. On **update/delete**: uses `findOneAndUpdate` / `findOneAndDelete` with the tenant condition merged into the filter, so cross-tenant access is impossible.

The `allTenants` flag (default `false`) is the override for cross-tenant access and requires both an admin tenant (`req.user.tenant.admin`) and the `OVERSEER` role. CRUD functions take `(req, ..., allTenants = false, sanitize = true, lean = true)` — keep this parameter convention when adding model functions.

### Audit fields

`setAutoField(req, data, AutoField.X)` in `modelService.js` populates `createdBy` (on create), `updatedBy` (on update), and `performedBy` (on stock events) from `req.user.userId`. Use the `AutoField` enum, don't set these fields by hand.

### Auth & authorization

- **Authentication**: `authenticationMiddleware` verifies the JWT and populates `req.user` (`userId`, `role`, `tenant: {id, admin}`). Applied globally in `app.js` *after* the public `/login` and `/api-docs` routes.
- **Authorization**: `authorizationMiddleware(module, feature)` (default export `authorize` in `src/middlewares/authorizationMiddleware.js`) looks up the caller's `Role` document and checks `role.rolePermission[module][feature].access`. Permissions are data in the DB, not code. The `feature` keys are the specific operation names (e.g. `createProduct`, `readProducts`, `readProductCategories`) — see `tests/setup/mockData.js` `createMockRole` for the full shape. When adding an endpoint, add its feature key to the relevant role's `rolePermission`.

### Middleware pipeline (order matters, defined in `app.js`)

```
helmet → cors → express.json → sanitizeAndValidateRequest → /login + /api-docs (public)
       → authenticationMiddleware → <protected routes> → validationErrorMiddleware → errorHandler
```

`sanitizeAndValidateRequest` enforces the size/depth limits from `config.js` (`MAX_*`) and sanitizes input. `errorMiddleware` produces the final error response (with a log ID); `validationErrorMiddleware` formats Mongoose validation errors before it.

## Conventions

- **Logging**: use `log(level, message, alwaysShow?, req?)` from `src/utils/logger.js`. Levels: `INFO`/`ERROR`/`CRITICAL`. Module files start with `const relativePath = getRelativePath(import.meta.url)` and prefix log messages with `${relativePath}: functionName()` for traceability.
- **Sanitization on output**: model functions run results through `sanitizeObjectFields(doc, protectedModelFields)` (strips `__v` etc.) when `sanitize` is true.
- **Enums** (e.g. `ProductUnits` in `productModel.js`, `AutoField`) are exported from the file that owns them and reused in tests — import them rather than hardcoding string literals.
- Some helpers/comments in `modelService.js` are in Finnish (e.g. `QueryBuilder`); that's expected.
- **API docs**: Swagger/OpenAPI is generated from JSDoc `@swagger` blocks in route files and served at `/api-docs`. New endpoints should carry a matching `@swagger` block.

## Tests

Vitest + Supertest integration tests in `tests/integration/modules/<domain>/`. Shared setup in `tests/setup/`:
- `db.js` — `setup()` connects to `DATABASE_URI_TEST`; `teardown()` drops the DB and disconnects.
- `mockData.js` — `createMockTenant/Role/User/ProductCategory`; exports `username`/`password` and `mockTenantId`. The mock role is `OVERSEER` with full permissions.
- `login.js` — `login()` returns the auth response; grab the JWT via `(await login()).body.login`.

Standard test flow: `beforeAll` → `setup()` → create mock data → log in for a JWT; `afterAll` → `teardown()`. Drive the app with `request(app)` and send `Authorization: Bearer <jwtToken>`.
