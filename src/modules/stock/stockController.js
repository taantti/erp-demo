import { stockService, stockEventService, inventoryService, shelfService } from './services/index.js';
import { log } from '../../utils/logger.js';
import { getRelativePath } from '../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

// Stock (warehouse) handlers

export const readStocks = async (req, res, next) => {
    log("INFO", `${relativePath}: readStocks(): `, true, req);
    try {
        const stocks = await stockService.readStocks(req, res, next);
        res.status(200).json(stocks);
    } catch (error) {
        return next(error);
    }
};

export const readStock = async (req, res, next) => {
    log("INFO", `${relativePath}: readStock(): `, true, req);
    try {
        const stock = await stockService.readStock(req, res, next);
        if (!stock) return res.status(404).json({ error: 'Stock not found' });
        res.status(200).json(stock);
    } catch (error) {
        return next(error);
    }
};

export const createStock = async (req, res, next) => {
    log("INFO", `${relativePath}: createStock(): `, true, req);
    try {
        const newStock = await stockService.createStock(req, res, next);
        if (!newStock) return res.status(400).json({ error: 'Stock not created' });
        res.status(201).json(newStock);
    } catch (error) {
        return next(error);
    }
};

export const updateStock = async (req, res, next) => {
    log("INFO", `${relativePath}: updateStock(): `, true, req);
    try {
        const updatedStock = await stockService.updateStock(req, res, next);
        if (!updatedStock) return res.status(404).json({ error: 'Stock not found' });
        res.status(200).json(updatedStock);
    } catch (error) {
        return next(error);
    }
};

export const deleteStock = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteStock(): `, true, req);
    try {
        const deletedStock = await stockService.deleteStock(req, res, next);
        if (!deletedStock) return res.status(404).json({ error: 'Stock not found' });
        res.status(200).json({ msg: 'Stock deleted' });
    } catch (error) {
        return next(error);
    }
};

// Stock event handlers

export const readStockEvents = async (req, res, next) => {
    log("INFO", `${relativePath}: readStockEvents(): `, true, req);
    try {
        const events = await stockEventService.readStockEvents(req, res, next);
        res.status(200).json(events);
    } catch (error) {
        return next(error);
    }
};

export const readStockEvent = async (req, res, next) => {
    log("INFO", `${relativePath}: readStockEvent(): `, true, req);
    try {
        const event = await stockEventService.readStockEvent(req, res, next);
        if (!event) return res.status(404).json({ error: 'Stock event not found' });
        res.status(200).json(event);
    } catch (error) {
        return next(error);
    }
};

export const createStockEvent = async (req, res, next) => {
    log("INFO", `${relativePath}: createStockEvent(): `, true, req);
    try {
        const newEvent = await stockEventService.createStockEvent(req, res, next);
        if (!newEvent) return res.status(400).json({ error: 'Stock event not created' });
        res.status(201).json(newEvent);
    } catch (error) {
        return next(error);
    }
};

export const updateStockEvent = async (req, res, next) => {
    log("INFO", `${relativePath}: updateStockEvent(): `, true, req);
    try {
        const updatedEvent = await stockEventService.updateStockEvent(req, res, next);
        if (!updatedEvent) return res.status(404).json({ error: 'Stock event not found' });
        res.status(200).json(updatedEvent);
    } catch (error) {
        return next(error);
    }
};

export const deleteStockEvent = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteStockEvent(): `, true, req);
    try {
        const deletedEvent = await stockEventService.deleteStockEvent(req, res, next);
        if (!deletedEvent) return res.status(404).json({ error: 'Stock event not found' });
        res.status(200).json({ msg: 'Stock event deleted' });
    } catch (error) {
        return next(error);
    }
};

// Inventory handlers

export const readInventories = async (req, res, next) => {
    log("INFO", `${relativePath}: readInventories(): `, true, req);
    try {
        const inventories = await inventoryService.readInventories(req, res, next);
        res.status(200).json(inventories);
    } catch (error) {
        return next(error);
    }
};

export const readInventory = async (req, res, next) => {
    log("INFO", `${relativePath}: readInventory(): `, true, req);
    try {
        const inventory = await inventoryService.readInventory(req, res, next);
        if (!inventory) return res.status(404).json({ error: 'Inventory not found' });
        res.status(200).json(inventory);
    } catch (error) {
        return next(error);
    }
};

export const createInventory = async (req, res, next) => {
    log("INFO", `${relativePath}: createInventory(): `, true, req);
    try {
        const newInventory = await inventoryService.createInventory(req, res, next);
        if (!newInventory) return res.status(400).json({ error: 'Inventory not created' });
        res.status(201).json(newInventory);
    } catch (error) {
        return next(error);
    }
};

export const updateInventory = async (req, res, next) => {
    log("INFO", `${relativePath}: updateInventory(): `, true, req);
    try {
        const updatedInventory = await inventoryService.updateInventory(req, res, next);
        if (!updatedInventory) return res.status(404).json({ error: 'Inventory not found' });
        res.status(200).json(updatedInventory);
    } catch (error) {
        return next(error);
    }
};

export const deleteInventory = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteInventory(): `, true, req);
    try {
        const deletedInventory = await inventoryService.deleteInventory(req, res, next);
        if (!deletedInventory) return res.status(404).json({ error: 'Inventory not found' });
        res.status(200).json({ msg: 'Inventory deleted' });
    } catch (error) {
        return next(error);
    }
};

// Shelf handlers

export const readShelves = async (req, res, next) => {
    log("INFO", `${relativePath}: readShelves(): `, true, req);
    try {
        const shelves = await shelfService.readShelves(req, res, next);
        res.status(200).json(shelves);
    } catch (error) {
        return next(error);
    }
};

export const readShelf = async (req, res, next) => {
    log("INFO", `${relativePath}: readShelf(): `, true, req);
    try {
        const shelf = await shelfService.readShelf(req, res, next);
        if (!shelf) return res.status(404).json({ error: 'Shelf not found' });
        res.status(200).json(shelf);
    } catch (error) {
        return next(error);
    }
};

export const createShelf = async (req, res, next) => {
    log("INFO", `${relativePath}: createShelf(): `, true, req);
    try {
        const newShelf = await shelfService.createShelf(req, res, next);
        if (!newShelf) return res.status(400).json({ error: 'Shelf not created' });
        res.status(201).json(newShelf);
    } catch (error) {
        return next(error);
    }
};

export const updateShelf = async (req, res, next) => {
    log("INFO", `${relativePath}: updateShelf(): `, true, req);
    try {
        const updatedShelf = await shelfService.updateShelf(req, res, next);
        if (!updatedShelf) return res.status(404).json({ error: 'Shelf not found' });
        res.status(200).json(updatedShelf);
    } catch (error) {
        return next(error);
    }
};

export const deleteShelf = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteShelf(): `, true, req);
    try {
        const deletedShelf = await shelfService.deleteShelf(req, res, next);
        if (!deletedShelf) return res.status(404).json({ error: 'Shelf not found' });
        res.status(200).json({ msg: 'Shelf deleted' });
    } catch (error) {
        return next(error);
    }
};
