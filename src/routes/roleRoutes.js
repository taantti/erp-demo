import express from 'express';
const router = express.Router();
import { readRoles, createRole, readRole, updateRole, deleteRole } from '../modules/role/roleController.js';
import authorizationMiddleware from '../middleware/authorizationMiddleware.js';

router.get('/search/:ids', authorizationMiddleware('role', 'readRoles'), readRoles);
router.get('/:id', authorizationMiddleware('role', 'readRole'), readRole);  
router.post('/', authorizationMiddleware('role', 'createRole'), createRole);
router.put('/:id', authorizationMiddleware('role', 'updateRole'), updateRole);
router.delete('/:id', authorizationMiddleware('role', 'deleteRole'), deleteRole);


export default router;