import { saleOrderService } from './services/index.js';

/**
 * Read all sale orders
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readSaleOrders = async (req, res, next) => {
    try {
        const saleOrders = await saleOrderService.readSaleOrders(req);
        res.status(200).json(saleOrders);
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a single sale order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readSaleOrder = async (req, res, next) => {
    try {
        const saleOrder = await saleOrderService.readSaleOrder(req);
        if (!saleOrder) return res.status(404).json({ error: 'Sale order not found' });
        res.status(200).json(saleOrder);
    } catch (error) {
        return next(error);
    }
};

/**
 * Create a new sale order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createSaleOrder = async (req, res, next) => {
    try {
        const newSaleOrder = await saleOrderService.createSaleOrder(req);
        if (!newSaleOrder) return res.status(400).json({ error: 'Sale order not created' });
        res.status(201).json(newSaleOrder);
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a sale order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateSaleOrder = async (req, res, next) => {
    try {
        const updatedSaleOrder = await saleOrderService.updateSaleOrder(req);
        if (!updatedSaleOrder) return res.status(404).json({ error: 'Sale order not found' });
        res.status(200).json(updatedSaleOrder);
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a sale order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteSaleOrder = async (req, res, next) => {
    try {
        const deletedSaleOrder = await saleOrderService.deleteSaleOrder(req);
        if (!deletedSaleOrder) return res.status(404).json({ error: 'Sale order not found' });
        res.status(200).json({ msg: 'Sale order deleted' });
    } catch (error) {
        return next(error);
    }
};

/**
 * Read all sale order items
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readItems = async (req, res, next) => {
    try {
        const items = await saleOrderService.readItems(req);
        res.status(200).json(items);
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a single sale order item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readItem = async (req, res, next) => {
    try {
        const item = await saleOrderService.readItem(req);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        return next(error);
    }
};

/**
 * Create a new sale order item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createItem = async (req, res, next) => {
    try {
        const newItem = await saleOrderService.createItem(req);
        if (!newItem) return res.status(400).json({ error: 'Item not created' });
        res.status(201).json(newItem);
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a sale order item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateItem = async (req, res, next) => {
    try {
        const updatedItem = await saleOrderService.updateItem(req);
        if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(updatedItem);
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a sale order item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteItem = async (req, res, next) => {
    try {
        const deletedItem = await saleOrderService.deleteItem(req);
        if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json({ msg: 'Item deleted' });
    } catch (error) {
        return next(error);
    }
};
