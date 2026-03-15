import mongoose from 'mongoose';
import { log } from "../utils/logger.js";
import { checkUserTenantPermissions, toPlainObjectIfLean, setAutoField, AutoField } from './modelService.js';
import { sanitizeObjectFields } from '../utils/sanitization.js';
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);
const protectedModelFields = ['__v'];

const TenantSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    admin: { type: Boolean, required: true },
    active: { type: Boolean, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

/**
 * Create a new tenant. Creating tenants is always an allTenants operation (admin only).
 * @param {Object} req - The request object.
 * @param {Object} tenantData - The tenant data to create.
 * @param {boolean} allTenants - Whether the user has admin-level access (must be true to create tenants).
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object>} - The created tenant object.
 */
export const newTenant = async (req, tenantData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: newTenant(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);

    try {
        checkUserTenantPermissions(req, allTenants, `${relativePath}: newTenant()`);
        tenantData = setAutoField(req, tenantData, AutoField.CREATED_BY);
        let tenant = await new Tenant({ ...tenantData }).save();
        if (lean) tenant = tenant.toObject();
        if (sanitize) tenant = sanitizeObjectFields(tenant, protectedModelFields);
        return tenant;
    } catch (error) {
        throw error;
    }
};

/**
 * Find a tenant by ID.
 * If allTenants is false, only the user's own tenant can be accessed.
 * @param {Object} req - The request object.
 * @param {string} tenantId - The ID of the tenant to find.
 * @param {boolean} allTenants - (Optional) Whether to allow access to any tenant.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The tenant object if found, otherwise null.
 */
export const findTenantById = async (req, tenantId, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findTenantById(): allTenants = ${allTenants}: lean = ${lean}`, true, req);

    try {
        checkUserTenantPermissions(req, allTenants, `${relativePath}: findTenantById()`);
        if (!allTenants && req.user.tenant.id.toString() !== tenantId.toString()) {
            log("WARN", `${relativePath}: findTenantById(): User attempted to access tenant ${tenantId} but belongs to ${req.user.tenant.id}`, true, req);
            return null;
        }
        let tenant = await Tenant.findById(tenantId).lean(lean).exec();
        if (sanitize) tenant = sanitizeObjectFields(tenant, protectedModelFields);
        return tenant;
    } catch (error) {
        throw error;
    }
};

/**
 * Find tenants based on query parameters.
 * If allTenants is false, only the user's own tenant is returned.
 * @param {Object} req - The request object.
 * @param {Object} params - The query parameters to filter tenants.
 * @param {boolean} allTenants - (Optional) Whether to allow access to all tenants.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Array>} - Returns an array of tenant objects (possibly empty array).
 */
export const findTenants = async (req, params = {}, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findTenants(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);

    try {
        checkUserTenantPermissions(req, allTenants, `${relativePath}: findTenants()`);
        if (!allTenants) {
            params._id = req.user.tenant.id;
        }
        let tenants = await Tenant.find(params).lean(lean).exec();
        if (sanitize) tenants = tenants.map(tenant => sanitizeObjectFields(tenant, protectedModelFields));
        return tenants;
    } catch (error) {
        throw error;
    }
};

/**
 * Find a tenant by ID and update.
 * If allTenants is false, only the user's own tenant can be updated.
 * @param {Object} req - The request object.
 * @param {string} tenantId - The ID of the tenant to update.
 * @param {Object} tenantData - The new data to update the tenant with.
 * @param {boolean} allTenants - (Optional) Whether to allow updating any tenant.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The updated tenant object if found and updated, otherwise null.
 */
export const findOneTenantAndUpdate = async (req, tenantId, tenantData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findOneTenantAndUpdate(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);

    try {
        checkUserTenantPermissions(req, allTenants, `${relativePath}: findOneTenantAndUpdate()`);
        if (!allTenants && req.user.tenant.id.toString() !== tenantId.toString()) {
            log("WARN", `${relativePath}: findOneTenantAndUpdate(): User attempted to update tenant ${tenantId} but belongs to ${req.user.tenant.id}`, true, req);
            return null;
        }
        let tenant = await findTenantById(req, tenantId, allTenants, false, false);
        if (!tenant) throw Object.assign(new Error(`Tenant with id ${tenantId} not found.`), { statusCode: 404 });

        tenantData = setAutoField(req, tenantData, AutoField.UPDATED_BY);
        Object.assign(tenant, tenantData);
        await tenant.save();
        tenant = toPlainObjectIfLean(tenant, lean);
        if (sanitize) tenant = sanitizeObjectFields(tenant, protectedModelFields);
        return tenant;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a tenant by ID. Deleting tenants is always an allTenants operation (admin only).
 * @param {Object} req - The request object.
 * @param {string} tenantId - The ID of the tenant to delete.
 * @param {boolean} allTenants - Whether the user has admin-level access (must be true to delete tenants).
 * @returns {Promise<Object|null>} - The deleted tenant object if found, otherwise null.
 */
export const deleteTenantById = async (req, tenantId, allTenants = false) => {
    log("INFO", `${relativePath}: deleteTenantById(): allTenants = ${allTenants}`, true, req);

    try {
        checkUserTenantPermissions(req, allTenants, `${relativePath}: deleteTenantById()`);
        return await Tenant.findByIdAndDelete(tenantId);
    } catch (error) {
        throw error;
    }
};

export const Tenant = mongoose.model('Tenant', TenantSchema);