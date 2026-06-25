import { findStocks, findStockById, createStock as modelCreateStock, updateStockById, deleteStockById } from '../../../models/index.js';

/**
 * Create a new stock.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const createStock = async (req, res, next) => {
    try {
        const stock = await modelCreateStock(req, req.body, false, true, true);
        return stock;
    } catch (error) {
        return next(error);
    }
};

/**
 * Get a stock by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const readStock = async (req, res, next) => {
    try {
        const stock = await findStockById(req, req.params.id, false, true, true);
        return stock;
    } catch (error) {
        return next(error);
    }
};

/**
 * Get all stocks.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const readStocks = async (req, res, next) => {
    try {
        const stocks = await findStocks(req, req.query, false, true, true);
        return stocks;
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a stock by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const updateStock = async (req, res, next) => {
    try {
        const stock = await updateStockById(req, req.params.id, req.body, false, true, true);
        return stock;
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a stock by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const deleteStock = async (req, res, next) => {
    try {
        const stock = await deleteStockById(req, req.params.id, false);
        return stock;
    } catch (error) {
        return next(error);
    }
};
