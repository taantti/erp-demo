import loginRoutes from './loginRoutes.js';
import productRoutes from './productRoutes.js';
import roleRoutes from './roleRoutes.js';
import tenantRoutes from './tenantRoutes.js';
import userRoutes from './userRoutes.js';

const routes = {
    login: loginRoutes,
    product: productRoutes,
    role: roleRoutes,
    tenant: tenantRoutes,
    user: userRoutes   
}

export default routes;