import express from 'express';
const router = express.Router();
import { login } from '../modules/login/loginController.js';
router.post('/', login);
export default router;
