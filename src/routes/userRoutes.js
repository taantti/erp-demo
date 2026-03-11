import express from 'express';
const router = express.Router();
import { readUsers, createUser, readUser, updateUserPassword, updateUser, deleteUser } from '../modules/user/userController.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';


/**
 * @swagger 
 * /user:
 *   post:
 *     summary: Create user
 *     description: Create user
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', authorizationMiddleware('user', 'createUser'), createUser);

/**
 * @swagger 
 * /user/search:
 *   get:
 *     summary: Get users
 *     description: Get users
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/search', authorizationMiddleware('user', 'readUser'), readUsers);

/**
 * @swagger 
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Get user by ID
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id', authorizationMiddleware('user', 'readUser'), readUser);

//router.post('/:id/reset-password', authorizationMiddleware('user', 'resetUserPassword'), resetUserPassword);

/**
 * @swagger 
 * /user/{id}/update-password:
 *   put:
 *     summary: Update user password
 *     description: Update user password
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:id/update-password', authorizationMiddleware('user', 'updateUserPassword'), updateUserPassword);

/**
 * @swagger 
 * /user/{id}:
 *   put:
 *     summary: Update user
 *     description: Update user
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:id', authorizationMiddleware('user', 'updateUser'), updateUser);

/**
 * @swagger 
 * /user/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete user
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/:id', authorizationMiddleware('user', 'deleteUser'), deleteUser);

export default router;