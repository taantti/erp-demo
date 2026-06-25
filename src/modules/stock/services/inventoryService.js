import { findInventories, findInventoryById, createInventory as modelCreateInventory, updateInventoryById, deleteInventoryById } from '../../../models/index.js';

/**
 * Create a new inventory.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const createInventory = async (req, res, next) => {
    try {
        const inventory = await modelCreateInventory(req, req.body, false, true, true);
        return inventory;
    } catch (error) {
        return next(error);
    }
};

/**
 * Read an inventory by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const readInventory = async (req, res, next) => {
    try {
        const inventory = await findInventoryById(req, req.params.id, false, true, true);
        return inventory;
    } catch (error) {
        return next(error);
    }
};

/**
 * Read all inventories.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const readInventories = async (req, res, next) => {
    try {
        const inventories = await findInventories(req, req.query, false, true, true);
        return inventories;
    } catch (error) {
        return next(error);
    }
};

/**
 * Update an inventory by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const updateInventory = async (req, res, next) => {
    try {
        const inventory = await updateInventoryById(req, req.params.id, req.body, false, true, true);
        return inventory;
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete an inventory by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const deleteInventory = async (req, res, next) => {
    try {
        const inventory = await deleteInventoryById(req, req.params.id, false);
        return inventory;
    } catch (error) {
        return next(error);
    }
};
