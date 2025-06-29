import express from 'express';
import aux from "../../utils/auxiliary.js";
import { createUser, readUser, readUsers, updateUser, deleteUser, readUserReport } from './services/index.js';

const router = express.Router();
router.get('/report/:id', readUserReport);
router.get('/search/:ids', readUsers);
router.post('/', createUser);
router.get('/:id', readUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
