import { newRole as modelNewRole, findRoleById, findRoles as modelFindRoles, findOneRoleAndUpdate, deleteRoleById } from '../../../models/index.js';
import { log } from '../../../utils/logger.js';
import { getRelativePath } from '../../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

export const createRole = async (req, res, next) => {
    log("INFO", `${relativePath}: createRole(): `, true, req);
    try {
        const role = await modelNewRole(req, req.body, true, true, true);
        return role;
    } catch (error) {
        return next(error);
    }
};

export const readRole = async (req, res, next) => {
    log("INFO", `${relativePath}: readRole(${req.params.id}): `, true, req);
    try {
        const role = await findRoleById(req, req.params.id, true, true, true);
        return role;
    } catch (error) {
        return next(error);
    }
};

export const readRoles = async (req, res, next) => {
    log("INFO", `${relativePath}: readRoles(): `, true, req);
    try {
        const ids = req.params.ids.split(',');
        const roles = await modelFindRoles(req, { _id: { $in: ids } }, true, true, true);
        return roles;
    } catch (error) {
        return next(error);
    }
};

export const updateRole = async (req, res, next) => {
    log("INFO", `${relativePath}: updateRole(${req.params.id}): `, true, req);
    try {
        const role = await findOneRoleAndUpdate(req, req.params.id, req.body, true, true, true);
        return role;
    } catch (error) {
        return next(error);
    }
};

export const deleteRole = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteRole(${req.params.id}): `, true, req);
    try {
        const role = await deleteRoleById(req, req.params.id, true);
        return role;
    } catch (error) {
        return next(error);
    }
};
