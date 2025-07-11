import express from 'express';
const router = express.Router();
import { readTenant, createTenant, updateTenant, deleteTenant } from '../modules/tenant/tenantController.js';

router.get('/:id', readTenant);
router.post('/', createTenant);
router.put('/:id', updateTenant);
router.delete('/:id', deleteTenant);

export default router;