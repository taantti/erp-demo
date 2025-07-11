import express from 'express';
const router = express.Router();
import { readTenants } from '../modules/tenant/tenantController.js';
router.get('/:ids', readTenants);
export default router;