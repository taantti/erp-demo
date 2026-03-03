import express from 'express';
const router = express.Router();
import { login } from '../modules/login/loginController.js';


/**
 * @swagger 
 * /login:
 *   post:
 *     summary: Login
 *     description: Login
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', login);




export default router;
