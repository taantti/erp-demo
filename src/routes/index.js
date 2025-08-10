import loginRoutes from './loginRoutes.js';
import userRoutes from './userRoutes.js';
import tenantRoutes from './tenantRoutes.js';
import roleRoutes from './roleRoutes.js';

const routes = {
    login: loginRoutes,
    tenant: tenantRoutes,
    user: userRoutes,
    role: roleRoutes
}

export default routes;