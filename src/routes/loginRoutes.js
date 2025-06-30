import express from 'express';
import loginController from '../modules/login/loginController.js';
const router = express.Router();
router.use(loginController);
export default router;
