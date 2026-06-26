import { newRole as modelNewRole, findRoleById, findRoles as modelFindRoles, findOneRoleAndUpdate, deleteRoleById } from '../../../models/index.js';

/**
 * Create a new role
 * @param {Object} req - Express request object
 */
export const createRole = async (req) => {
    return await modelNewRole(req, req.body, true, true, true);
};

/**
 * Read a role
 * @param {Object} req - Express request object
 */
export const readRole = async (req) => {
    return await findRoleById(req, req.params.id, true, true, true);
};

/**
 * Read roles
 * @param {Object} req - Express request object
 */
export const readRoles = async (req) => {
    const ids = req.params.ids.split(',');
    return await modelFindRoles(req, { _id: { $in: ids } }, true, true, true);
};

/**
 * Update a role
 * @param {Object} req - Express request object
 */
export const updateRole = async (req) => {
    return await findOneRoleAndUpdate(req, req.params.id, req.body, true, true, true);
};

/**
 * Delete a role
 * @param {Object} req - Express request object
 */
export const deleteRole = async (req) => {
    return await deleteRoleById(req, req.params.id, true);
};
