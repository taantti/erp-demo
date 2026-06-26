import { findStocks, findStockById, createStock as modelCreateStock, updateStockById, deleteStockById } from '../../../models/index.js';

/**
 * Create a new stock.
 * @param {Object} req - The request object.
 */
export const createStock = async (req) => {
    return await modelCreateStock(req, req.body, false, true, true);
};

/**
 * Get a stock by ID.
 * @param {Object} req - The request object.
 */
export const readStock = async (req) => {
    return await findStockById(req, req.params.id, false, true, true);
};

/**
 * Get all stocks.
 * @param {Object} req - The request object.
 */
export const readStocks = async (req) => {
    return await findStocks(req, req.query, false, true, true);
};

/**
 * Update a stock by ID.
 * @param {Object} req - The request object.
 */
export const updateStock = async (req) => {
    return await updateStockById(req, req.params.id, req.body, false, true, true);
};

/**
 * Delete a stock by ID.
 * @param {Object} req - The request object.
 */
export const deleteStock = async (req) => {
    return await deleteStockById(req, req.params.id, false);
};
