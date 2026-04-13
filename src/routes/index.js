import loginRoutes from './loginRoutes.js';
import productRoutes from './productRoutes.js';
import roleRoutes from './roleRoutes.js';
import tenantRoutes from './tenantRoutes.js';
import userRoutes from './userRoutes.js';
import stockRoutes from './stockRoutes.js';
import assetRoutes from './assetRoutes.js';

const routes = {
    login: loginRoutes,
    product: productRoutes,
    role: roleRoutes,
    tenant: tenantRoutes,
    user: userRoutes,
    stock: stockRoutes,
    asset: assetRoutes
}

export default routes;