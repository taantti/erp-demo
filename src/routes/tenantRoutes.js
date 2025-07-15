import express from 'express';
const router = express.Router();
import { readTenants, readTenant, createTenant, updateTenant, deleteTenant } from '../modules/tenant/tenantController.js';

router.get('/search/:ids', readTenants);
router.get('/:id', readTenant);
router.post('/', createTenant);
router.put('/:id', updateTenant);
router.delete('/:id', deleteTenant);

export default router;
