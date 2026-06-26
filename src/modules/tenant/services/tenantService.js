import { newTenant as modelNewTenant, findTenantById, findTenants as modelFindTenants, findOneTenantAndUpdate, deleteTenantById } from '../../../models/index.js';

/**
 * Create a new tenant
 * @param {Object} req - Express request object
 */
export const createTenant = async (req) => {
    const tenantData = { ...req.body, active: true };
    return await modelNewTenant(req, tenantData, true, true, true);
};

/**
 * Read a tenant
 * @param {Object} req - Express request object
 */
export const readTenant = async (req) => {
    return await findTenantById(req, req.params.id, false, true, true);
};

/**
 * Read tenants
 * @param {Object} req - Express request object
 */
export const readTenants = async (req) => {
    const ids = req.params.ids.split(',');
    return await modelFindTenants(req, { _id: { $in: ids } }, false, true, true);
};

/**
 * Update a tenant
 * @param {Object} req - Express request object
 */
export const updateTenant = async (req) => {
    return await findOneTenantAndUpdate(req, req.params.id, req.body, false, true, true);
};

/**
 * Delete a tenant
 * @param {Object} req - Express request object
 */
export const deleteTenant = async (req) => {
    return await deleteTenantById(req, req.params.id, true);
};
