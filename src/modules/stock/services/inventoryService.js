import { findInventories, findInventoryById, createInventory as modelCreateInventory, updateInventoryById, deleteInventoryById } from '../../../models/index.js';

/**
 * Create a new inventory.
 * @param {Object} req - The request object.
 */
export const createInventory = async (req) => {
    return await modelCreateInventory(req, req.body, false, true, true);
};

/**
 * Read an inventory by ID.
 * @param {Object} req - The request object.
 */
export const readInventory = async (req) => {
    return await findInventoryById(req, req.params.id, false, true, true);
};

/**
 * Read all inventories.
 * @param {Object} req - The request object.
 */
export const readInventories = async (req) => {
    return await findInventories(req, req.query, false, true, true);
};

/**
 * Update an inventory by ID.
 * @param {Object} req - The request object.
 */
export const updateInventory = async (req) => {
    return await updateInventoryById(req, req.params.id, req.body, false, true, true);
};

/**
 * Delete an inventory by ID.
 * @param {Object} req - The request object.
 */
export const deleteInventory = async (req) => {
    return await deleteInventoryById(req, req.params.id, false);
};
