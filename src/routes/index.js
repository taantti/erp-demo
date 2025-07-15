import loginRoutes from './loginRoutes.js';
import userRoutes from './userRoutes.js';
import tenantRoutes from './tenantRoutes.js';

const routes = {
    login: loginRoutes,
    tenant: tenantRoutes,
    user: userRoutes
}

export default routes;