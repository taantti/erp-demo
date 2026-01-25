import express from 'express';
const router = express.Router();
import { readTenants, readTenant, createTenant, updateTenant, deleteTenant } from '../modules/tenant/tenantController.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

router.get('/search/:ids', authorizationMiddleware('tenant', 'readTenants'), readTenants);
router.get('/:id', authorizationMiddleware('tenant', 'readTenant'), readTenant);
router.post('/', authorizationMiddleware('tenant', 'createTenant'), createTenant);
router.put('/:id', authorizationMiddleware('tenant', 'updateTenant'), updateTenant);
router.delete('/:id', authorizationMiddleware('tenant', 'deleteTenant'), deleteTenant);

export default router;
