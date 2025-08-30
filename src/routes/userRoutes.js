import express from 'express';
const router = express.Router();
import { readUsers, createUser, readUser, updateUser, deleteUser, readUserReport } from '../modules/user/userController.js';
import authorizationMiddleware from '../middleware/authorizationMiddleware.js';

router.get('/report/:id', authorizationMiddleware('user', 'readUserReport'), readUserReport);

router.get('/search/:ids', authorizationMiddleware('user', 'readUsers'), readUsers);
//router.get('/search/:ids', authorizationMiddleware('user', 'readUser'), readUsers);

router.get('/:id', authorizationMiddleware('user', 'readUser'), readUser);
router.post('/', authorizationMiddleware('user', 'createUser'), createUser);
router.put('/:id', authorizationMiddleware('user', 'updateUser'), updateUser);
router.delete('/:id', authorizationMiddleware('user', 'deleteUser'), deleteUser);

export default router;