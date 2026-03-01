import tenantService from './services/index.js';
import { log } from '../../utils/logger.js';
import { getRelativePath } from '../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

export const readTenants = async (req, res, next) => {
    log("INFO", `${relativePath}: readTenants(): `, true, req);
    try {
        const tenants = await tenantService.readTenants(req, res, next);
        res.status(200).json(tenants);
    } catch (error) {
        return next(error);
    }
};

export const readTenant = async (req, res, next) => {
    log("INFO", `${relativePath}: readTenant(): `, true, req);
    try {
        const tenant = await tenantService.readTenant(req, res, next);
        if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
        res.status(200).json(tenant);
    } catch (error) {
        return next(error);
    }
};

export const createTenant = async (req, res, next) => {
    log("INFO", `${relativePath}: createTenant(): `, true, req);
    try {
        const newTenant = await tenantService.createTenant(req, res, next);
        if (!newTenant) return res.status(404).json({ error: 'Tenant not created' });
        res.status(201).json(newTenant);
    } catch (error) {
        return next(error);
    }
};

export const updateTenant = async (req, res, next) => {
    log("INFO", `${relativePath}: updateTenant(): `, true, req);
    try {
        const updatedTenant = await tenantService.updateTenant(req, res, next);
        if (!updatedTenant) return res.status(404).json({ error: 'Tenant not found' });
        res.status(200).json(updatedTenant);
    } catch (error) {
        return next(error);
    }
};

export const deleteTenant = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteTenant(): `, true, req);
    try {
        const deletedTenant = await tenantService.deleteTenant(req, res, next);
        if (!deletedTenant) return res.status(404).json({ error: 'Tenant not found' });
        res.status(200).json({ msg: 'Tenant deleted' });
    } catch (error) {
        return next(error);
    }
};
