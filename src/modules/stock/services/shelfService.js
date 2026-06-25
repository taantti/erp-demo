import { findShelves, findShelfById, createShelf as modelCreateShelf, updateShelfById, deleteShelfById } from '../../../models/index.js';

/**
 * Create a new shelf.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const createShelf = async (req, res, next) => {
    try {
        const shelf = await modelCreateShelf(req, req.body, false, true, true);
        return shelf;
    } catch (error) {
        return next(error);
    }
};

/**
 * Get a shelf by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const readShelf = async (req, res, next) => {
    try {
        const shelf = await findShelfById(req, req.params.id, false, true, true);
        return shelf;
    } catch (error) {
        return next(error);
    }
};

/**
 * Get all shelves.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const readShelves = async (req, res, next) => {
    try {
        const shelves = await findShelves(req, req.query, false, true, true);
        return shelves;
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a shelf by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const updateShelf = async (req, res, next) => {
    try {
        const shelf = await updateShelfById(req, req.params.id, req.body, false, true, true);
        return shelf;
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a shelf by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const deleteShelf = async (req, res, next) => {
    try {
        const shelf = await deleteShelfById(req, req.params.id, false);
        return shelf;
    } catch (error) {
        return next(error);
    }
};
