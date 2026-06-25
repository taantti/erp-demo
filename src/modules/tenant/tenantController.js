import tenantService from './services/index.js';

/**
 * Read tenants
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readTenants = async (req, res, next) => {
    try {
        const tenants = await tenantService.readTenants(req, res, next);
        res.status(200).json(tenants);
    } catch (error) {
        return next(error);
    }
};

/**
 * Read tenant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readTenant = async (req, res, next) => {
    try {
        const tenant = await tenantService.readTenant(req, res, next);
        if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
        res.status(200).json(tenant);
    } catch (error) {
        return next(error);
    }
};

/**
 * Create tenant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createTenant = async (req, res, next) => {
    try {
        const newTenant = await tenantService.createTenant(req, res, next);
        if (!newTenant) return res.status(404).json({ error: 'Tenant not created' });
        res.status(201).json(newTenant);
    } catch (error) {
        return next(error);
    }
};

/**
 * Update tenant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateTenant = async (req, res, next) => {
    try {
        const updatedTenant = await tenantService.updateTenant(req, res, next);
        if (!updatedTenant) return res.status(404).json({ error: 'Tenant not found' });
        res.status(200).json(updatedTenant);
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete tenant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteTenant = async (req, res, next) => {
    try {
        const deletedTenant = await tenantService.deleteTenant(req, res, next);
        if (!deletedTenant) return res.status(404).json({ error: 'Tenant not found' });
        res.status(200).json({ msg: 'Tenant deleted' });
    } catch (error) {
        return next(error);
    }
};
