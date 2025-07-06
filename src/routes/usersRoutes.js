import express from 'express';
const router = express.Router();
import { readUsers } from '../modules/user/userController.js';
router.get('/:ids', readUsers);
export default router;