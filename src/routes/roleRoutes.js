import express from 'express';
const router = express.Router();
import { readRoles, createRole, readRole, updateRole, deleteRole } from '../modules/role/roleController.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

/**
 * @swagger 
 */
router.post('/', authorizationMiddleware('role', 'createRole'), createRole);

/**
 * @swagger 
 */
router.get('/search/:ids', authorizationMiddleware('role', 'readRoles'), readRoles);

/**
 * @swagger 
 */
router.get('/:id', authorizationMiddleware('role', 'readRole'), readRole);  

/**
 * @swagger 
 */
router.put('/:id', authorizationMiddleware('role', 'updateRole'), updateRole);

/**
 * @swagger 
 */
router.delete('/:id', authorizationMiddleware('role', 'deleteRole'), deleteRole);


export default router;