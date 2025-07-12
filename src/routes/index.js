import loginRoutes from './loginRoutes.js';
import userRoutes from './userRoutes.js';
import usersRoutes from './usersRoutes.js';
import tenantRoutes from './tenantRoutes.js';
import tenantsRoutes from './tenantsRoutes.js';

const routes = {
    login: loginRoutes,
    tenant: tenantRoutes,
    tenants: tenantsRoutes,
    user: userRoutes,
    users: usersRoutes
}

export default routes;