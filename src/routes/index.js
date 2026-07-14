import loginRoutes from './loginRoutes.js';
import productRoutes from './productRoutes.js';
import roleRoutes from './roleRoutes.js';
import tenantRoutes from './tenantRoutes.js';
import userRoutes from './userRoutes.js';
import stockRoutes from './stockRoutes.js';
import assetRoutes from './assetRoutes.js';
import customerRoutes from './customerRoutes.js';
import purchaseOrderRoutes from './purchaseOrderRoutes.js';
import saleOrderRoutes from './saleOrderRoutes.js';
// --- api-create-module-route import marker: inserts new route imports above this line. ---

const routes = {
    login: loginRoutes,
    product: productRoutes,
    role: roleRoutes,
    tenant: tenantRoutes,
    user: userRoutes,
    stock: stockRoutes,
    asset: assetRoutes,
    customer: customerRoutes,
    purchaseOrder: purchaseOrderRoutes,
    saleOrder: saleOrderRoutes,
    // --- api-create-module-route object marker: inserts new route entries above this line. ----
}

export default routes;