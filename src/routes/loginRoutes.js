import express from 'express';
const router = express.Router();
import { login } from '../modules/login/loginController.js';

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user and get JWT token
 *     description: Authenticate with username and password to receive a JWT token for accessing protected endpoints.
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: Password1!
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 login:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Invalid credentials (wrong username or password)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: User is not active or has no role assigned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', login);

export default router;
