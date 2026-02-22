import express from 'express';
const router = express.Router();
import { readUsers, createUser, readUser, updateUserPassword, updateUser, deleteUser } from '../modules/user/userController.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

router.post('/', authorizationMiddleware('user', 'createUser'), createUser);
router.get('/search', authorizationMiddleware('user', 'readUser'), readUsers);
router.get('/:id', authorizationMiddleware('user', 'readUser'), readUser);
//router.post('/:id/reset-password', authorizationMiddleware('user', 'resetUserPassword'), resetUserPassword);
router.put('/:id/update-password', authorizationMiddleware('user', 'updateUserPassword'), updateUserPassword);
router.put('/:id', authorizationMiddleware('user', 'updateUser'), updateUser);
router.delete('/:id', authorizationMiddleware('user', 'deleteUser'), deleteUser);

export default router;