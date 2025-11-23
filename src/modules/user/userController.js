import userService from './services/index.js';
import { log } from '../../utils/logger.js';
import { getRelativePath } from '../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

export const readUsers = async (req, res, next) => {
    log("INFO", `${relativePath}: readUsers(): `, true, req);
    try {
        const users = await userService.readUsers(req, res, next);
        res.status(200).json(users);
    } catch (error) {
        return next(error);
    }
};

export const readUser = async (req, res, next) => {
    log("INFO", `${relativePath}: readUser(): `, true, req);
    try {
        const user = await userService.readUser(req, res, next);
        res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
};

export const createUser = async (req, res, next) => {
    log("INFO", `${relativePath}: createUser(): `, true, req);
    try {
        const newUser = await userService.createUser(req, res, next);
        if (!newUser) return res.status(404).json({ error: 'User not created' });
        res.status(201).json(newUser);
    } catch (error) {
        return next(error);
    }
};

export const updateUser = async (req, res, next) => {
    log("INFO", `${relativePath}: updateUser(): `, true, req);
    try {
        const updatedUser = await userService.updateUser(req, res, next);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        return next(error);
    }
};


export const updateUserPassword = async (req, res, next) => {
    log("INFO", `${relativePath}: updateUserPassword(): `, true, req);
    try {
        const result = await userService.updateUserPassword(req, res, next);
        if (!result) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ msg: 'Password updated' });
    } catch (error) {
        return next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteUser(): `, true, req);
    try {
        const deletedUser = await userService.deleteUser(req, res, next);
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ msg: 'User deleted' });
    } catch (error) {
        return next(error);
    }
};
























