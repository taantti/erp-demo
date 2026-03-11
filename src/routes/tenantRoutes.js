import express from 'express';
const router = express.Router();
import { readTenants, readTenant, createTenant, updateTenant, deleteTenant } from '../modules/tenant/tenantController.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

/**
 * @swagger 
 * /tenant/search/{ids}:
 *   get:
 *     summary: Get tenants by IDs
 *     description: Get tenants by IDs
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/search/:ids', authorizationMiddleware('tenant', 'readTenants'), readTenants);

/**
 * @swagger 
 * /tenant/{id}:
 *   get:
 *     summary: Get tenant by ID
 *     description: Get tenant by ID
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id', authorizationMiddleware('tenant', 'readTenant'), readTenant);

/**
 * @swagger 
 * /tenant:
 *   post:
 *     summary: Create tenant
 *     description: Create tenant
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', authorizationMiddleware('tenant', 'createTenant'), createTenant);

/**
 * @swagger 
 * /tenant/{id}:
 *   put:
 *     summary: Update tenant
 *     description: Update tenant
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:id', authorizationMiddleware('tenant', 'updateTenant'), updateTenant);

/**
 * @swagger 
 * /tenant/{id}:
 *   delete:
 *     summary: Delete tenant
 *     description: Delete tenant
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/:id', authorizationMiddleware('tenant', 'deleteTenant'), deleteTenant);

export default router;
