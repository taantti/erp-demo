import mongoose from 'mongoose';
import { log } from '../utils/logger.js';
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

/**
 * Check user's tenant permissions.
 * @param {Object} req - Express request object
 * @param {boolean} allTenants - Is admin access required for all tenants
 * @param {string} context - (Optional) Context description for logging
 * @returns {void}
 * @throws {Error} - Throws "Permission denied" error if permissions are insufficient
 */
export const checkUserTenantPermissions = (req, allTenants, context = "") => {
    log("INFO", `${relativePath}: checkUserTenantPermissions(): allTenants = ${allTenants}`, true, req);

    if (0) throw new Error("Testi"); // For testing error handling

    if (allTenants && !isAdminTenant(req)) {
        log("CRITICAL", `${context}: Admin tenant access required to access all tenants documents. This should not happen!`, true, req);
        throw new Error("Permission denied");
    }

    if (allTenants && !isOverseerRole(req)) {
        log("CRITICAL", `${context}: Overseer role required to access all tenants documents. This should not happen!`, true, req);
        throw new Error("Permission denied");
    }

    if (!allTenants && !checkTenant(req)) {
        log("CRITICAL", `${context}: User must belong to a tenant. This should not happen!`, true, req);
        throw new Error("Permission denied");
    }
};

/**
 * Check if the users tenant is an admin tenant.
 * @param {Object} req - The request object.
 * @returns {boolean} - True if the users tenant is an admin tenant, false otherwise.
 */
export const isAdminTenant = (req) => {
    if (!req?.user?.tenant?.admin) {
        log("ERROR", `${relativePath}: isAdminTenant: User ${req?.user?.username} is not an admin.`, false, req);
        return false;
    }
    return true;
}

/**
 * Check if the user has the OVERSEER role.
 * @param {Object} req - The request object.
 * @returns {boolean} - True if the user has the OVERSEER role, false otherwise.
 */
export const isOverseerRole = (req) => {
    if (req?.user?.role !== 'OVERSEER') {
        log("ERROR", `${relativePath}: isOverseerRole: User ${req?.user?.username} role is not an OVERSEER.`, false, req);
        return false;
    }
    return true;
}

/**
 * Check if the user has a tenant.
 * @param {Object} req - The request object.
 * @returns {boolean} - True if the user has a tenant, false otherwise.
 */
export const checkTenant = (req) => {
    log("INFO", `${relativePath}: checkTenant`, true, req);
    if (!req?.user?.tenant?.id) {
        log("ERROR", `${relativePath}: checkTenant: User ${req?.user?.username} has no tenant.`, false, req);
        return false;
    }
    return true;
}

/**
 * Initialize the tenant condition parameter for queries.
 * Used when querying documents. Example: GET /users.
 * If allTenants is false or params.tenant is not set, set params.tenant to the user's tenantId.
 * @param {Object} req - The request object.
 * @param {Object} params - The query parameters object.
 * @param {boolean} allTenants - Whether to include all tenants or not.
 * @returns {ObjectId} - The tenant ID to use in the query. 
 */
export const getTenantIdForQuery = (req, tenant, allTenants) => {
    log("INFO", `${relativePath}: getTenantIdForQuery(): allTenants = ${allTenants}`, true, req);
    if (!allTenants || !tenant) tenant = req.user.tenant.id;
    return new mongoose.Types.ObjectId(tenant);
}

/**
 * Get the tenant query condition for database queries.
 * Used when querying documents. Example: GET /users or GET /users/:id.
 * @param {string} tenantId - The tenant ID to use in the query.
 * @param {boolean} allTenants - Whether to include all tenants or not.
 * @returns {Object} - The tenant query condition.
 */
export const getTenantQueryCondition = (req, tenantId, allTenants) => {
    log("INFO", `${relativePath}: getTenantQueryCondition(): allTenants = ${allTenants}`, true, req);
    if (allTenants) return {};
    return { tenant: new mongoose.Types.ObjectId(tenantId) };
}

/*
    * Set the tenant field in the data object if allTenants is false.
    * Used when creating or updating documents. Example: POST /users or PUT /users/:id.
    * @param {Object} req - The request object.
    * @param {Object} data - The data object to set the tenant field in.
    * @param {boolean} allTenants - Whether to include all tenants or not.
    * @returns {Object} - The data object with the tenant field set if applicable.
    */
export const setTenantForData = (req, data, allTenants = false) => {
    if (!allTenants) data.tenant = req.user.tenant.id;
    return data;
};

/**
 * Convert a Mongoose document to a plain JavaScript object if the query was executed with the `lean` option.
 * @param {*} document - The Mongoose document to convert. (JSDoc type * means "any type" is accepted)
 * @param {*} lean - Whether the query was executed with the `lean` option. (JSDoc type * means "any type")
 * @returns {*} - The plain JavaScript object or the original document. (JSDoc type * means "any type")
 */
export const toPlainObjectIfLean = (document, lean) => {
    if(!document || !lean) return document;
    return document.toObject();
}