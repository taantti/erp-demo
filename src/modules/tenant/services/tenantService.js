import { newTenant as modelNewTenant, findTenantById, findTenants as modelFindTenants, findOneTenantAndUpdate, deleteTenantById } from '../../../models/index.js';

/**
 * Create a new tenant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createTenant = async (req, res, next) => {
    try {
        const tenantData = { ...req.body, active: true };
        const tenant = await modelNewTenant(req, tenantData, true, true, true);
        return tenant;
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a tenant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readTenant = async (req, res, next) => {
    try {
        const tenant = await findTenantById(req, req.params.id, false, true, true);
        return tenant;
    } catch (error) {
        return next(error);
    }
};

/**
 * Read tenants
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readTenants = async (req, res, next) => {
    try {
        const ids = req.params.ids.split(',');
        const tenants = await modelFindTenants(req, { _id: { $in: ids } }, false, true, true);
        return tenants;
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a tenant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateTenant = async (req, res, next) => {
    try {
        const tenant = await findOneTenantAndUpdate(req, req.params.id, req.body, false, true, true);
        return tenant;
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a tenant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteTenant = async (req, res, next) => {
    try {
        const tenant = await deleteTenantById(req, req.params.id, true);
        return tenant;
    } catch (error) {
        return next(error);
    }
};
