import { findShelves, findShelfById, createShelf as modelCreateShelf, updateShelfById, deleteShelfById } from '../../../models/index.js';

/**
 * Create a new shelf.
 * @param {Object} req - The request object.
 */
export const createShelf = async (req) => {
    return await modelCreateShelf(req, req.body, false, true, true);
};

/**
 * Get a shelf by ID.
 * @param {Object} req - The request object.
 */
export const readShelf = async (req) => {
    return await findShelfById(req, req.params.id, false, true, true);
};

/**
 * Get all shelves.
 * @param {Object} req - The request object.
 */
export const readShelves = async (req) => {
    return await findShelves(req, req.query, false, true, true);
};

/**
 * Update a shelf by ID.
 * @param {Object} req - The request object.
 */
export const updateShelf = async (req) => {
    return await updateShelfById(req, req.params.id, req.body, false, true, true);
};

/**
 * Delete a shelf by ID.
 * @param {Object} req - The request object.
 */
export const deleteShelf = async (req) => {
    return await deleteShelfById(req, req.params.id, false);
};
