import express from 'express';
const router = express.Router();
import { createUser, readUser, readUsers, updateUser, deleteUser, readUserReport } from '../modules/user/userController.js';

router.get('/report/:id', readUserReport);
router.get('/search/:ids', readUsers);
router.get('/:id', readUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;