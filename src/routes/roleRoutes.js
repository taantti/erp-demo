import express from 'express';
const router = express.Router();
import { readRoles, createRole, readRole, updateRole, deleteRole } from '../modules/role/roleController.js';

router.get('/search/:ids', readRoles);
router.get('/:id', createRole);
router.post('/', readRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

export default router;