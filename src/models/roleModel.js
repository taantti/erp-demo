import mongoose from 'mongoose';
import { log } from "../utils/logger.js";
import { checkUserTenantPermissions, toPlainObjectIfLean, setAutoField, AutoField } from './modelService.js';
import { sanitizeObjectFields } from '../utils/sanitization.js';
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);
const protectedModelFields = ['__v'];

export const roles = ['OVERSEER', 'ADMIN', 'WRITER', 'READER'];

const PermissionSchema = new mongoose.Schema({   
    access: { type: Boolean, required: true },
    adminTenantOnly: { type: Boolean, required: true },
    immutable: { type: Boolean, required: true },
});

const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    role: { type: String, required: true, enum: roles },
    rolePermission: {
        product: { type: Map, of: PermissionSchema },
        productCategory: { type: Map, of: PermissionSchema },
        role: { type: Map, of: PermissionSchema },
        tenant: { type: Map, of: PermissionSchema },
        user: { type: Map, of: PermissionSchema }
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

/**
 * Create a new role. Roles are global entities, managing them requires allTenants (admin+overseer).
 * @param {Object} req - The request object.
 * @param {Object} roleData - The role data to create.
 * @param {boolean} allTenants - Whether the user has admin-level access.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object>} - The created role object.
 */
export const newRole = async (req, roleData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: newRole(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);

    try {
        checkUserTenantPermissions(req, allTenants, `${relativePath}: newRole()`);
        roleData = setAutoField(req, roleData, AutoField.CREATED_BY);
        let role = await new Role({ ...roleData }).save();
        if (lean) role = role.toObject();
        if (sanitize) role = sanitizeObjectFields(role, protectedModelFields);
        return role;
    } catch (error) {
        throw error;
    }
};

/**
 * Find a role by ID.
 * @param {Object} req - The request object.
 * @param {string} roleId - The ID of the role to find.
 * @param {boolean} allTenants - Whether the user has admin-level access.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The role object if found, otherwise null.
 */
export const findRoleById = async (req, roleId, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findRoleById(): allTenants = ${allTenants}: lean = ${lean}`, true, req);

    try {
        checkUserTenantPermissions(req, allTenants, `${relativePath}: findRoleById()`);
        let role = await Role.findById(roleId).lean(lean).exec();
        if (sanitize) role = sanitizeObjectFields(role, protectedModelFields);
        return role;
    } catch (error) {
        throw error;
    }
};

/**
 * Find roles based on query parameters.
 * @param {Object} req - The request object.
 * @param {Object} params - The query parameters to filter roles.
 * @param {boolean} allTenants - Whether the user has admin-level access.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Array>} - Returns an array of role objects (possibly empty array).
 */
export const findRoles = async (req, params = {}, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findRoles(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);

    try {
        checkUserTenantPermissions(req, allTenants, `${relativePath}: findRoles()`);
        let roles = await Role.find(params).lean(lean).exec();
        if (sanitize) roles = roles.map(role => sanitizeObjectFields(role, protectedModelFields));
        return roles;
    } catch (error) {
        throw error;
    }
};

/**
 * Find a role by ID and update.
 * @param {Object} req - The request object.
 * @param {string} roleId - The ID of the role to update.
 * @param {Object} roleData - The new data to update the role with.
 * @param {boolean} allTenants - Whether the user has admin-level access.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The updated role object if found and updated, otherwise null.
 */
export const findOneRoleAndUpdate = async (req, roleId, roleData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findOneRoleAndUpdate(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);

    try {
        checkUserTenantPermissions(req, allTenants, `${relativePath}: findOneRoleAndUpdate()`);
        let role = await findRoleById(req, roleId, allTenants, false, false);
        if (!role) throw Object.assign(new Error(`Role with id ${roleId} not found.`), { statusCode: 404 });

        roleData = setAutoField(req, roleData, AutoField.UPDATED_BY);
        Object.assign(role, roleData);
        await role.save();
        role = toPlainObjectIfLean(role, lean);
        if (sanitize) role = sanitizeObjectFields(role, protectedModelFields);
        return role;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a role by ID.
 * @param {Object} req - The request object.
 * @param {string} roleId - The ID of the role to delete.
 * @param {boolean} allTenants - Whether the user has admin-level access.
 * @returns {Promise<Object|null>} - The deleted role object if found, otherwise null.
 */
export const deleteRoleById = async (req, roleId, allTenants = false) => {
    log("INFO", `${relativePath}: deleteRoleById(): allTenants = ${allTenants}`, true, req);

    try {
        checkUserTenantPermissions(req, allTenants, `${relativePath}: deleteRoleById()`);
        return await Role.findByIdAndDelete(roleId);
    } catch (error) {
        throw error;
    }
};

export const Role = mongoose.model('Role', RoleSchema);