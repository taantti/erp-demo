import { stockService, stockEventService, inventoryService, shelfService } from './services/index.js';

/**
 * Read all stocks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readStocks = async (req, res, next) => {
    try {
        const stocks = await stockService.readStocks(req);
        res.status(200).json(stocks);
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a single stock
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readStock = async (req, res, next) => {
    try {
        const stock = await stockService.readStock(req);
        if (!stock) return res.status(404).json({ error: 'Stock not found' });
        res.status(200).json(stock);
    } catch (error) {
        return next(error);
    }
};

/**
 * Create a new stock
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createStock = async (req, res, next) => {
    try {
        const newStock = await stockService.createStock(req);
        if (!newStock) return res.status(400).json({ error: 'Stock not created' });
        res.status(201).json(newStock);
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a stock
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateStock = async (req, res, next) => {
    try {
        const updatedStock = await stockService.updateStock(req);
        if (!updatedStock) return res.status(404).json({ error: 'Stock not found' });
        res.status(200).json(updatedStock);
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a stock
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteStock = async (req, res, next) => {
    try {
        const deletedStock = await stockService.deleteStock(req);
        if (!deletedStock) return res.status(404).json({ error: 'Stock not found' });
        res.status(200).json({ msg: 'Stock deleted' });
    } catch (error) {
        return next(error);
    }
};


/**
 * Read all stock events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readStockEvents = async (req, res, next) => {
    try {
        const events = await stockEventService.readStockEvents(req);
        res.status(200).json(events);
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a single stock event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readStockEvent = async (req, res, next) => {
    try {
        const event = await stockEventService.readStockEvent(req);
        if (!event) return res.status(404).json({ error: 'Stock event not found' });
        res.status(200).json(event);
    } catch (error) {
        return next(error);
    }
};

/**
 * Create a new stock event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createStockEvent = async (req, res, next) => {
    try {
        const newEvent = await stockEventService.createStockEvent(req);
        if (!newEvent) return res.status(400).json({ error: 'Stock event not created' });
        res.status(201).json(newEvent);
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a stock event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateStockEvent = async (req, res, next) => {
    try {
        const updatedEvent = await stockEventService.updateStockEvent(req);
        if (!updatedEvent) return res.status(404).json({ error: 'Stock event not found' });
        res.status(200).json(updatedEvent);
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a stock event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteStockEvent = async (req, res, next) => {
    try {
        const deletedEvent = await stockEventService.deleteStockEvent(req);
        if (!deletedEvent) return res.status(404).json({ error: 'Stock event not found' });
        res.status(200).json({ msg: 'Stock event deleted' });
    } catch (error) {
        return next(error);
    }
};


/**
 * Read all inventories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readInventories = async (req, res, next) => {
    try {
        const inventories = await inventoryService.readInventories(req);
        res.status(200).json(inventories);
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a single inventory
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readInventory = async (req, res, next) => {
    try {
        const inventory = await inventoryService.readInventory(req);
        if (!inventory) return res.status(404).json({ error: 'Inventory not found' });
        res.status(200).json(inventory);
    } catch (error) {
        return next(error);
    }
};

/**
 * Create a new inventory
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createInventory = async (req, res, next) => {
    try {
        const newInventory = await inventoryService.createInventory(req);
        if (!newInventory) return res.status(400).json({ error: 'Inventory not created' });
        res.status(201).json(newInventory);
    } catch (error) {
        return next(error);
    }
};

/**
 * Update an inventory
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateInventory = async (req, res, next) => {
    try {
        const updatedInventory = await inventoryService.updateInventory(req);
        if (!updatedInventory) return res.status(404).json({ error: 'Inventory not found' });
        res.status(200).json(updatedInventory);
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete an inventory
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteInventory = async (req, res, next) => {
    try {
        const deletedInventory = await inventoryService.deleteInventory(req);
        if (!deletedInventory) return res.status(404).json({ error: 'Inventory not found' });
        res.status(200).json({ msg: 'Inventory deleted' });
    } catch (error) {
        return next(error);
    }
};

/**
 * Read all shelves
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readShelves = async (req, res, next) => {
    try {
        const shelves = await shelfService.readShelves(req);
        res.status(200).json(shelves);
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a single shelf
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readShelf = async (req, res, next) => {
    try {
        const shelf = await shelfService.readShelf(req);
        if (!shelf) return res.status(404).json({ error: 'Shelf not found' });
        res.status(200).json(shelf);
    } catch (error) {
        return next(error);
    }
};

/**
 * Create a new shelf
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createShelf = async (req, res, next) => {
    try {
        const newShelf = await shelfService.createShelf(req);
        if (!newShelf) return res.status(400).json({ error: 'Shelf not created' });
        res.status(201).json(newShelf);
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a shelf
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateShelf = async (req, res, next) => {
    try {
        const updatedShelf = await shelfService.updateShelf(req);
        if (!updatedShelf) return res.status(404).json({ error: 'Shelf not found' });
        res.status(200).json(updatedShelf);
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a shelf
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteShelf = async (req, res, next) => {
    try {
        const deletedShelf = await shelfService.deleteShelf(req);
        if (!deletedShelf) return res.status(404).json({ error: 'Shelf not found' });
        res.status(200).json({ msg: 'Shelf deleted' });
    } catch (error) {
        return next(error);
    }
};
