import express from 'express';
const router = express.Router();
import { readUsers, createUser, readUser, updateUserPassword, updateUser, deleteUser } from '../modules/user/userController.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';


/**
 * @swagger 
 */
router.post('/', authorizationMiddleware('user', 'createUser'), createUser);

/**
 * @swagger 
 */
router.get('/search', authorizationMiddleware('user', 'readUser'), readUsers);

/**
 * @swagger 
 */
router.get('/:id', authorizationMiddleware('user', 'readUser'), readUser);

//router.post('/:id/reset-password', authorizationMiddleware('user', 'resetUserPassword'), resetUserPassword);

/**
 * @swagger 
 */
router.put('/:id/update-password', authorizationMiddleware('user', 'updateUserPassword'), updateUserPassword);

/**
 * @swagger 
 */
router.put('/:id', authorizationMiddleware('user', 'updateUser'), updateUser);

/**
 * @swagger 
 */
router.delete('/:id', authorizationMiddleware('user', 'deleteUser'), deleteUser);

export default router;