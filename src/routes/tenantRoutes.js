import express from 'express';
const router = express.Router();
import { readTenants, readTenant, createTenant, updateTenant, deleteTenant } from '../modules/tenant/tenantController.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

/**
 * @swagger 
 */
router.get('/search/:ids', authorizationMiddleware('tenant', 'readTenants'), readTenants);

/**
 * @swagger 
 */
router.get('/:id', authorizationMiddleware('tenant', 'readTenant'), readTenant);

/**
 * @swagger 
 */
router.post('/', authorizationMiddleware('tenant', 'createTenant'), createTenant);

/**
 * @swagger 
 */
router.put('/:id', authorizationMiddleware('tenant', 'updateTenant'), updateTenant);

/**
 * @swagger 
 */
router.delete('/:id', authorizationMiddleware('tenant', 'deleteTenant'), deleteTenant);

export default router;
