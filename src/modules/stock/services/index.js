import { createStock, readStock, readStocks, updateStock, deleteStock } from './stockService.js';
import { createStockEvent, readStockEvent, readStockEvents, updateStockEvent, deleteStockEvent } from './eventService.js';
import { createInventory, readInventory, readInventories, updateInventory, deleteInventory } from './inventoryService.js';
import { createShelf, readShelf, readShelves, updateShelf, deleteShelf } from './shelfService.js';

export const stockService = {
    createStock,
    readStock,
    readStocks,
    updateStock,
    deleteStock
};

export const stockEventService = {
    createStockEvent,
    readStockEvent,
    readStockEvents,
    updateStockEvent,
    deleteStockEvent
};

export const inventoryService = {
    createInventory,
    readInventory,
    readInventories,
    updateInventory,
    deleteInventory
};

export const shelfService = {
    createShelf,
    readShelf,
    readShelves,
    updateShelf,
    deleteShelf
};
