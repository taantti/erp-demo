import { newTenant as modelNewTenant, findTenantById, findTenants as modelFindTenants, findOneTenantAndUpdate, deleteTenantById } from '../../../models/index.js';
import { log } from '../../../utils/logger.js';
import { getRelativePath } from '../../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

export const createTenant = async (req, res, next) => {
    log("INFO", `${relativePath}: createTenant(): `, true, req);
    try {
        const tenantData = { ...req.body, active: true };
        const tenant = await modelNewTenant(req, tenantData, true, true, true);
        return tenant;
    } catch (error) {
        return next(error);
    }
};

export const readTenant = async (req, res, next) => {
    log("INFO", `${relativePath}: readTenant(${req.params.id}): `, true, req);
    try {
        const tenant = await findTenantById(req, req.params.id, false, true, true);
        return tenant;
    } catch (error) {
        return next(error);
    }
};

export const readTenants = async (req, res, next) => {
    log("INFO", `${relativePath}: readTenants(): `, true, req);
    try {
        const ids = req.params.ids.split(',');
        const tenants = await modelFindTenants(req, { _id: { $in: ids } }, false, true, true);
        return tenants;
    } catch (error) {
        return next(error);
    }
};

export const updateTenant = async (req, res, next) => {
    log("INFO", `${relativePath}: updateTenant(${req.params.id}): `, true, req);
    try {
        const tenant = await findOneTenantAndUpdate(req, req.params.id, req.body, false, true, true);
        return tenant;
    } catch (error) {
        return next(error);
    }
};

export const deleteTenant = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteTenant(${req.params.id}): `, true, req);
    try {
        const tenant = await deleteTenantById(req, req.params.id, true);
        return tenant;
    } catch (error) {
        return next(error);
    }
};
