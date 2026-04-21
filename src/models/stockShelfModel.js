import mongoose from 'mongoose';
import { log } from "../utils/logger.js";
import { checkUserTenantPermissions, getTenantIdForQuery, getTenantQueryCondition, setTenantForData, setAutoField, AutoField } from './modelService.js';
import { sanitizeObjectFields } from '../utils/sanitization.js';
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);
const protectedModelFields = ['__v'];

const ShelfSchema = new mongoose.Schema({
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  parentShelfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelf' },
  name: { type: String, required: true, minlength: 1, maxlength: 100 },
  code: { type: String, required: true, minlength: 1, maxlength: 50 },
  location: { type: String, maxlength: 200 },
  capacity: { type: Number },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }
});

ShelfSchema.pre('save', async function (next) {
    this.updatedAt = new Date();
    return next();
});

/**
 * Create a new shelf.
 * @param {Object} req - The request object.
 * @param {Object} shelfData - The shelf data to create.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object>} - The created shelf object.
 */
export const createShelf = async (req, shelfData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: createShelf(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: createShelf()`);
    shelfData = setTenantForData(req, shelfData, allTenants);
    shelfData = setAutoField(req, shelfData, AutoField.CREATED_BY);
    let newShelf = await new Shelf({ ...shelfData }).save();
    if (lean) newShelf = newShelf.toObject();
    if (sanitize) newShelf = sanitizeObjectFields(newShelf, protectedModelFields);
    return newShelf;
};

/**
 * Find shelves based on query parameters.
 * @param {Object} req - The request object.
 * @param {Object} params - The query parameters to filter shelves.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Array>} - Returns an array of shelf objects (possibly empty array).
 */
export const findShelves = async (req, params = {}, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findShelves(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findShelves()`);
    params.tenant = getTenantIdForQuery(req, params.tenant, allTenants);
    let shelves = await Shelf.find(params).lean(lean).exec();
    if (sanitize) shelves = shelves.map(s => sanitizeObjectFields(s, protectedModelFields));
    return shelves;
};

/**
 * Find a shelf by ID.
 * @param {Object} req - The request object.
 * @param {string} shelfId - The ID of the shelf to find.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The shelf object if found, otherwise null.
 */
export const findShelfById = async (req, shelfId, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findShelfById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findShelfById()`);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    let shelf = await Shelf.findOne({ _id: shelfId, ...tenantCondition }).lean(lean).exec();
    if (sanitize) shelf = sanitizeObjectFields(shelf, protectedModelFields);
    return shelf;
};

/**
 * Find a shelf by ID and update.
 * @param {Object} req - The request object.
 * @param {string} shelfId - The ID of the shelf to update.
 * @param {Object} shelfData - The new data to update the shelf with.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The updated shelf object if found and updated, otherwise null.
 */
export const updateShelfById = async (req, shelfId, shelfData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: updateShelfById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: updateShelfById()`);
    shelfData = setAutoField(req, shelfData, AutoField.UPDATED_BY);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    let updatedShelf = await Shelf.findOneAndUpdate({ _id: shelfId, ...tenantCondition }, shelfData, { new: true }).lean(lean).exec();
    if (sanitize) updatedShelf = sanitizeObjectFields(updatedShelf, protectedModelFields);
    return updatedShelf;
};

/**
 * Delete a shelf by ID.
 * @param {Object} req - The request object.
 * @param {string} shelfId - The ID of the shelf to delete.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @returns {Promise<Object|null>} - The deleted shelf object if found, otherwise null.
 */
export const deleteShelfById = async (req, shelfId, allTenants = false) => {
    log("INFO", `${relativePath}: deleteShelfById(): allTenants = ${allTenants}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: deleteShelfById()`);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    return await Shelf.findOneAndDelete({ _id: shelfId, ...tenantCondition });
};

export const Shelf = mongoose.model('Shelf', ShelfSchema);