import express from 'express';
const router = express.Router();
import { readRoles, createRole, readRole, updateRole, deleteRole } from '../modules/role/roleController.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

/**
 * @swagger 
 * /role:
 *   post:
 *     summary: Create role
 *     description: Create role
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', authorizationMiddleware('role', 'createRole'), createRole);

/**
 * @swagger 
 * /role/search/{ids}:
 *   get:
 *     summary: Get roles by IDs
 *     description: Get roles by IDs
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/search/:ids', authorizationMiddleware('role', 'readRoles'), readRoles);

/**
 * @swagger 
 * /role/{id}:
 *   get:
 *     summary: Get role by ID
 *     description: Get role by ID
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id', authorizationMiddleware('role', 'readRole'), readRole);  

/**
 * @swagger 
 * /role/{id}:
 *   put:
 *     summary: Update role
 *     description: Update role
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:id', authorizationMiddleware('role', 'updateRole'), updateRole);

/**
 * @swagger 
 * /role/{id}:
 *   delete:
 *     summary: Delete role
 *     description: Delete role
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/:id', authorizationMiddleware('role', 'deleteRole'), deleteRole);


export default router;