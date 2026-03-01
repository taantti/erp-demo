import roleService from './services/index.js';
import { log } from '../../utils/logger.js';
import { getRelativePath } from '../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

export const readRoles = async (req, res, next) => {
    log("INFO", `${relativePath}: readRoles(): `, true, req);
    try {
        const roles = await roleService.readRoles(req, res, next);
        res.status(200).json(roles);
    } catch (error) {
        return next(error);
    }
};

export const readRole = async (req, res, next) => {
    log("INFO", `${relativePath}: readRole(): `, true, req);
    try {
        const role = await roleService.readRole(req, res, next);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.status(200).json(role);
    } catch (error) {
        return next(error);
    }
};

export const createRole = async (req, res, next) => {
    log("INFO", `${relativePath}: createRole(): `, true, req);
    try {
        const newRole = await roleService.createRole(req, res, next);
        if (!newRole) return res.status(404).json({ error: 'Role not created' });
        res.status(201).json(newRole);
    } catch (error) {
        return next(error);
    }
};

export const updateRole = async (req, res, next) => {
    log("INFO", `${relativePath}: updateRole(): `, true, req);
    try {
        const updatedRole = await roleService.updateRole(req, res, next);
        if (!updatedRole) return res.status(404).json({ error: 'Role not found' });
        res.status(200).json(updatedRole);
    } catch (error) {
        return next(error);
    }
};

export const deleteRole = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteRole(): `, true, req);
    try {
        const deletedRole = await roleService.deleteRole(req, res, next);
        if (!deletedRole) return res.status(404).json({ error: 'Role not found' });
        res.status(200).json({ msg: 'Role deleted' });
    } catch (error) {
        return next(error);
    }
};
