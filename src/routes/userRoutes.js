import express from 'express';
import userController from '../modules/user/userController.js';
const router = express.Router();
//router.use('/user', userController);
router.use(userController);
export default router;
