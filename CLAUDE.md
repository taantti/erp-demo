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

`npm test` runs with `--fileParallelism=false` (serial). Tests use an **in-memory MongoDB replica set** via `mongodb-memory-server` (`tests/setup/db.js`) — no external Mongo or `DATABASE_URI_TEST` needed; each test file gets its own fresh server (started in `beforeAll`, stopped in `afterAll`). It's a single-node **replica set** (not standalone) because some flows use multi-document transactions (e.g. stock transfer), which require one.

For the dev server (`npm start`), copy `.env-example` to `.env` (DB URI, JWT secrets, etc.). `npm run build` is a no-op placeholder.

## Architecture

Every domain module flows through four layers. Match this when adding features:

```
Request → Route → Controller → Service → Model → MongoDB
```

- **Route** (`src/routes/*Routes.js`) — endpoint + Swagger JSDoc + per-route `authorizationMiddleware(module, feature)`. Routes are aggregated in `src/routes/index.js` and mounted in `src/app.js`.
- **Controller** (`src/modules/<domain>/<domain>Controller.js`) — owns HTTP: reads `req`, calls `service.fn(req)`, sets status codes (200/201/400/404). It is the **only** layer with a try/catch that forwards errors via `next(error)`. No business logic.
- **Service** (`src/modules/<domain>/services/*Service.js`) — HTTP-agnostic: takes `(req)`, calls model functions, and **returns data or throws**. It does NOT receive `res`/`next` and never calls `next(error)` (errors propagate up to the controller).
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

### Embedded sub-resources (order line items)

`purchaseOrder` and `saleOrder` embed their line items as an array subdocument (`items: [ItemSchema]`), **not** a separate collection. The item CRUD model functions load the **parent** order (not `.lean()`), mutate the `items` array, and save the parent — addressing items by their subdocument `_id`:
- add: `order.items.push(itemData)` · find: `order.items.id(itemId)` · update: `item.set(itemData)` · delete: `item.deleteOne()`

Item routes are sub-resources: `/{order}/:id/item/:itemId`. Since both order models export generically-named item functions (`createItem`, `findItems`, …), `src/models/index.js` re-exports them under prefixed aliases (`createPOItem`/`createSOItem`, …) to avoid name collisions.

### Auth & authorization

- **Authentication**: `authenticationMiddleware` verifies the JWT and populates `req.user` (`userId`, `role`, `tenant: {id, admin}`). Applied globally in `app.js` *after* the public `/login` and `/api-docs` routes.
- **Authorization**: `authorizationMiddleware(module, feature)` (default export `authorize` in `src/middlewares/authorizationMiddleware.js`) looks up the caller's `Role` document and checks `role.rolePermission[module][feature].access`. Permissions are data in the DB, not code. The `feature` keys are the specific operation names (e.g. `createProduct`, `readProducts`, `readProductCategories`). Feature-key names must match the route's `authorizationMiddleware('module','feature')` exactly.

  **Adding permissions — three places must agree:** (1) `RoleSchema.rolePermission` in `src/models/roleModel.js` — a NEW module key (e.g. `customer`, `purchaseOrder`) **must** be added here as `{ type: Map, of: PermissionSchema }`, or Mongoose strict mode silently strips it on save → `403` at the module check. (A new *feature* inside an existing module needs no schema change — the module is a `Map`.) (2) `initRoleData` in `tests/setup/mockData.js` (the test role). (3) the four `src/scripts/init/data/init*Permissions.json` seed files (production roles).

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
- `db.js` — `setup()` starts an in-memory MongoDB replica set (`mongodb-memory-server`) and connects Mongoose; `teardown()` disconnects and stops it. Each test file gets a fresh, isolated server.
- `mockData.js` — `createMockX(options = {})` factories (tenant, role, user, product, productCategory, stock, shelf, inventory, customer, purchaseOrder + items, saleOrder + items). Each merges `{ ...initXData[0], tenant: mockTenantId, ...options }` — pass foreign keys and field overrides in the options object. Exports `username_1`/`password_1` and `mockTenantId`. The mock role (`initRoleData`) is `OVERSEER` with all module permissions.
- `login.js` — `login()` returns the auth response; grab the JWT via `(await login()).body.login`.

Standard test flow: `beforeAll` → `setup()` → create mock data → log in for a JWT; `afterAll` → `teardown()`. Drive the app with `request(app)` and send `Authorization: Bearer <jwtToken>`.
