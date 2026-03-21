import mongoose from 'mongoose';
import { log } from "../utils/logger.js";
import { checkUserTenantPermissions, getTenantIdForQuery, getTenantQueryCondition, setTenantForData, setAutoField, AutoField } from './modelService.js';
import { sanitizeObjectFields } from '../utils/sanitization.js';
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);
const protectedModelFields = ['__v'];

const InventorySchema = new mongoose.Schema({
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  shelfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelf' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 0 },
  reservedQuantity: { type: Number, default: 0 },
  lastStocktakeDate: { type: Date },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }
});

InventorySchema.pre('save', async function (next) {
    this.updatedAt = new Date();
    return next();
});

/**
 * Create a new inventory entry.
 * @param {Object} req - The request object.
 * @param {Object} inventoryData - The inventory data to create.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object>} - The created inventory object.
 */
export const createInventory = async (req, inventoryData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: createInventory(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: createInventory()`);
    inventoryData = setTenantForData(req, inventoryData, allTenants);
    inventoryData = setAutoField(req, inventoryData, AutoField.CREATED_BY);
    let newInventory = await new Inventory({ ...inventoryData }).save();
    if (lean) newInventory = newInventory.toObject();
    if (sanitize) newInventory = sanitizeObjectFields(newInventory, protectedModelFields);
    return newInventory;
};

/**
 * Find inventories based on query parameters.
 * @param {Object} req - The request object.
 * @param {Object} params - The query parameters to filter inventories.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Array>} - Returns an array of inventory objects (possibly empty array).
 */
export const findInventories = async (req, params = {}, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findInventories(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findInventories()`);
    params.tenant = getTenantIdForQuery(req, params.tenant, allTenants);
    let inventories = await Inventory.find(params).lean(lean).exec();
    if (sanitize) inventories = inventories.map(i => sanitizeObjectFields(i, protectedModelFields));
    return inventories;
};

/**
 * Find an inventory entry by ID.
 * @param {Object} req - The request object.
 * @param {string} inventoryId - The ID of the inventory entry to find.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The inventory object if found, otherwise null.
 */
export const findInventoryById = async (req, inventoryId, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findInventoryById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findInventoryById()`);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    let inventory = await Inventory.findOne({ _id: inventoryId, ...tenantCondition }).lean(lean).exec();
    if (sanitize) inventory = sanitizeObjectFields(inventory, protectedModelFields);
    return inventory;
};

/**
 * Find an inventory entry by ID and update.
 * @param {Object} req - The request object.
 * @param {string} inventoryId - The ID of the inventory entry to update.
 * @param {Object} inventoryData - The new data to update the inventory entry with.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The updated inventory object if found and updated, otherwise null.
 */
export const updateInventoryById = async (req, inventoryId, inventoryData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: updateInventoryById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: updateInventoryById()`);
    inventoryData = setAutoField(req, inventoryData, AutoField.UPDATED_BY);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    let updatedInventory = await Inventory.findOneAndUpdate({ _id: inventoryId, ...tenantCondition }, inventoryData, { new: true }).lean(lean).exec();
    if (sanitize) updatedInventory = sanitizeObjectFields(updatedInventory, protectedModelFields);
    return updatedInventory;
};

/**
 * Delete an inventory entry by ID.
 * @param {Object} req - The request object.
 * @param {string} inventoryId - The ID of the inventory entry to delete.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @returns {Promise<Object|null>} - The deleted inventory object if found, otherwise null.
 */
export const deleteInventoryById = async (req, inventoryId, allTenants = false) => {
    log("INFO", `${relativePath}: deleteInventoryById(): allTenants = ${allTenants}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: deleteInventoryById()`);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    return await Inventory.findOneAndDelete({ _id: inventoryId, ...tenantCondition });
};

export const Inventory = mongoose.model('Inventory', InventorySchema);