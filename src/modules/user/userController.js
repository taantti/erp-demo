import express from 'express';
//import aux from "../../utils/auxiliary.js";

import { createUser, readUser, readUsers, updateUser, deleteUser, readUserReport } from './services/index.js';
const router = express.Router();
//aux.consoleLog('userController.js');

router.post('/', createUser);
router.get('/:id', readUser);
router.get('/:ids', readUsers);
router.get('/:id/report', readUserReport);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
export default router;
