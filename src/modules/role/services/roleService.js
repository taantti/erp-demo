import { newRole as modelNewRole, findRoleById, findRoles as modelFindRoles, findOneRoleAndUpdate, deleteRoleById } from '../../../models/index.js';

/**
 * Create a new role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createRole = async (req, res, next) => {
    try {
        const role = await modelNewRole(req, req.body, true, true, true);
        return role;
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readRole = async (req, res, next) => {
    try {
        const role = await findRoleById(req, req.params.id, true, true, true);
        return role;
    } catch (error) {
        return next(error);
    }
};

/**
 * Read roles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readRoles = async (req, res, next) => {
    try {
        const ids = req.params.ids.split(',');
        const roles = await modelFindRoles(req, { _id: { $in: ids } }, true, true, true);
        return roles;
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateRole = async (req, res, next) => {
    try {
        const role = await findOneRoleAndUpdate(req, req.params.id, req.body, true, true, true);
        return role;
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteRole = async (req, res, next) => {
    try {
        const role = await deleteRoleById(req, req.params.id, true);
        return role;
    } catch (error) {
        return next(error);
    }
};
