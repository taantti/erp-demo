import roleService from './services/index.js';

/**
 * Read roles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readRoles = async (req, res, next) => {
    try {
        const roles = await roleService.readRoles(req);
        res.status(200).json(roles);
    } catch (error) {
        return next(error);
    }
};

/**
 * Read role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readRole = async (req, res, next) => {
    try {
        const role = await roleService.readRole(req);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.status(200).json(role);
    } catch (error) {
        return next(error);
    }
};

/**
 * Create role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createRole = async (req, res, next) => {
    try {
        const newRole = await roleService.createRole(req);
        if (!newRole) return res.status(404).json({ error: 'Role not created' });
        res.status(201).json(newRole);
    } catch (error) {
        return next(error);
    }
};

/**
 * Update role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateRole = async (req, res, next) => {
    try {
        const updatedRole = await roleService.updateRole(req);
        if (!updatedRole) return res.status(404).json({ error: 'Role not found' });
        res.status(200).json(updatedRole);
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteRole = async (req, res, next) => {
    try {
        const deletedRole = await roleService.deleteRole(req);
        if (!deletedRole) return res.status(404).json({ error: 'Role not found' });
        res.status(200).json({ msg: 'Role deleted' });
    } catch (error) {
        return next(error);
    }
};
