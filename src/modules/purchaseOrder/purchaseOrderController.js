import { purchaseOrderService } from './services/index.js';

/**
 * Read all purchase orders
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readPurchaseOrders = async (req, res, next) => {
    try {
        const purchaseOrders = await purchaseOrderService.readPurchaseOrders(req);
        res.status(200).json(purchaseOrders);
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a single purchase order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readPurchaseOrder = async (req, res, next) => {
    try {
        const purchaseOrder = await purchaseOrderService.readPurchaseOrder(req);
        if (!purchaseOrder) return res.status(404).json({ error: 'Purchase order not found' });
        res.status(200).json(purchaseOrder);
    } catch (error) {
        return next(error);
    }
};

/**
 * Create a new purchase order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createPurchaseOrder = async (req, res, next) => {
    try {
        const newPurchaseOrder = await purchaseOrderService.createPurchaseOrder(req);
        if (!newPurchaseOrder) return res.status(400).json({ error: 'Purchase order not created' });
        res.status(201).json(newPurchaseOrder);
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a purchase order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updatePurchaseOrder = async (req, res, next) => {
    try {
        const updatedPurchaseOrder = await purchaseOrderService.updatePurchaseOrder(req);
        if (!updatedPurchaseOrder) return res.status(404).json({ error: 'Purchase order not found' });
        res.status(200).json(updatedPurchaseOrder);
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a purchase order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deletePurchaseOrder = async (req, res, next) => {
    try {
        const deletedPurchaseOrder = await purchaseOrderService.deletePurchaseOrder(req);
        if (!deletedPurchaseOrder) return res.status(404).json({ error: 'Purchase order not found' });
        res.status(200).json({ msg: 'Purchase order deleted' });
    } catch (error) {
        return next(error);
    }
};

/**
 * Read all purchase order items
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readItems = async (req, res, next) => {
    try {
        const items = await purchaseOrderService.readItems(req);
        res.status(200).json(items);
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a single purchase order item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readItem = async (req, res, next) => {
    try {
        const item = await purchaseOrderService.readItem(req);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        return next(error);
    }
};

/**
 * Create a new purchase order item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createItem = async (req, res, next) => {
    try {
        const newItem = await purchaseOrderService.createItem(req);
        if (!newItem) return res.status(400).json({ error: 'Item not created' });
        res.status(201).json(newItem);
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a purchase order item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateItem = async (req, res, next) => {
    try {
        const updatedItem = await purchaseOrderService.updateItem(req);
        if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(updatedItem);
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a purchase order item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteItem = async (req, res, next) => {
    try {
        const deletedItem = await purchaseOrderService.deleteItem(req);
        if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json({ msg: 'Item deleted' });
    } catch (error) {
        return next(error);
    }
};
