import express from 'express';
import aux from "./utils/auxiliary.js";

import { createUser, readUser, readUsers, updateUser, deleteUser, readUserReport } from './services/index.js';
const router = express.Router();
aux.consoleLog('userController.js');


router.post('/', createUser);
router.get('/:id', readUser);
router.get('/:ids', readUsers);
router.get('/:id/report', readUserReport);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);




/*
const createUser = (req, res, next) => {
    aux.consoleLog('createUser(): ');
    res.status(501).json(['Not Implemented yet']);
}

const readUser = (req, res, next) => {
    aux.consoleLog('readUse(): ');
    const userId = parseInt(req.params.id);
    aux.consoleLog("userId: " + userId);
    res.status(501).json(['Not Implemented yet']);
}

const readUsers = (req, res, next) => {
    aux.consoleLog('readUsers(): ');
    res.status(501).json(['Not Implemented yet']);
}
const updateUser = (req, res, next) => {
    aux.consoleLog('updateUser(): ');
    const userId = parseInt(req.params.id);
    aux.consoleLog("userId: " + userId);
    res.status(501).json(['Not Implemented yet']);
}

const deleteUser = (req, res, next) => {
    aux.consoleLog('deleteUser(): ');
    const userId = parseInt(req.params.id);
    aux.consoleLog("userId: " + userId);
    res.status(501).json(['Not Implemented yet']);
}
*/

//export { createUser, readUser, readUsers, updateUser, deleteUser };
