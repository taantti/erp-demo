import mongoose from 'mongoose';
import { StockEventTypes } from '../../../models/stockEventModel.js';
import { findStockEvents, findStockEventById, createStockEvent as modelCreateStockEvent, updateStockEventById, deleteStockEventById } from '../../../models/index.js';
import { findInventories, createInventory } from '../../../models/index.js';
import { log } from '../../../utils/logger.js';
import { getRelativePath } from '../../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

/**
 * Create a new stock event.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const createStockEvent = async (req, res, next) => {
    log("INFO", `${relativePath}: createStockEvent(): `, true, req);
    try {
        await processStockEvent(req);
        const event = await modelCreateStockEvent(req, req.body, false, true, true);
        return event;
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a stock event by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const readStockEvent = async (req, res, next) => {
    log("INFO", `${relativePath}: readStockEvent(${req.params.id}): `, true, req);
    try {
        const event = await findStockEventById(req, req.params.id, false, true, true);
        return event;
    } catch (error) {
        return next(error);
    }
};

/**
 * Read all stock events.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const readStockEvents = async (req, res, next) => {
    log("INFO", `${relativePath}: readStockEvents(): `, true, req);
    try {
        const events = await findStockEvents(req, req.query, false, true, true);
        return events;
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a stock event by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const updateStockEvent = async (req, res, next) => {
    log("INFO", `${relativePath}: updateStockEvent(${req.params.id}): `, true, req);
    try {
        await processStockEventUpdate(req);
        const event = await updateStockEventById(req, req.params.id, req.body, false, true, true);
        return event;
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a stock event by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const deleteStockEvent = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteStockEvent(${req.params.id}): `, true, req);
    try {
        const event = await deleteStockEventById(req, req.params.id, false);
        return event;
    } catch (error) {
        return next(error);
    }
};

/**
 * Process a stock event based on its type.
 * @param {Object} req - The request object.
 * @returns 
 */
const processStockEvent = async (req) => {
    switch (req.body.eventType) {
        case StockEventTypes.RECEIPT:
            return processReceiptStockEvent(req);
        case StockEventTypes.ISSUE:
            return processIssueStockEvent(req);
        case StockEventTypes.TRANSFER:
            return processTransferStockEvent(req);
        case StockEventTypes.ADJUSTMENT:
            return processAdjustmentStockEvent(req);
        default:
            throw new Error("Unknown stock event type");
    }
};

/**
 * Process a receipt stock event.
 * @param {Object} req - The request object.
 * @returns 
 */
const processReceiptStockEvent = async (req) => {
    // TODO: Implement receipt stock event processing logic
    // For now, just return a success response
    return { success: true, message: "Receipt stock event processed successfully" };
};

/**
 * Process an issue stock event.
 * @param {Object} req - The request object.
 * @returns 
 */
const processIssueStockEvent = async (req) => {
    // TODO: Implement issue stock event processing logic
    // For now, just return a success response
    return { success: true, message: "Issue stock event processed successfully" };
};

/**
 * Process a transfer stock event.
 * @param {Object} req - The request object.
 * @throws {Error} If the transfer fails.
 */
const processTransferStockEvent = async (req) => {
    const sourceParams = {
        stockId: req.body.sourceStockId,
        shelfId: req.body.sourceShelfId,
        productId: req.body.productId
    }

    const destinationParams = {
        stockId: req.body.destinationStockId,
        shelfId: req.body.destinationShelfId,
        productId: req.body.productId
    }

    const sourceInventoryes = await findInventories(req, sourceParams, false, false, false);

    if (sourceInventoryes.length > 1) {
        throw new Error("Multiple source inventories found");
    }

    if (sourceInventoryes.length === 0) {
        throw new Error("Source inventory not found");
    }

    const destinationInventoryes = await findInventories(req, destinationParams, false, false, false);

    if (destinationInventoryes.length > 1) {
        throw new Error("Multiple destination inventories found");
    }

    let destinationInventory = null;
    if (destinationInventoryes.length === 0) {
        destinationInventory = await createInventory(req, {
            stockId: req.body.destinationStockId,
            shelfId: req.body.destinationShelfId,
            productId: req.body.productId,
            quantity: 0,
        }, false, false, false);

        destinationInventoryes[0] = destinationInventory;
    }

    if (sourceInventoryes[0].quantity - req.body.quantity < 0) {
        throw new Error("Not enough stock to transfer");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        sourceInventoryes[0].quantity -= req.body.quantity;
        destinationInventoryes[0].quantity += req.body.quantity;

        await sourceInventoryes[0].save({ session });
        await destinationInventoryes[0].save({ session });

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        if (destinationInventory) await destinationInventory.deleteOne();
        throw error;
    } finally {
        session.endSession();
    }
};

/**
 * Process an adjustment stock event.
 * @param {Object} req - The request object. 
 * @throws {Error} If the adjustment fails. 
 */
const processAdjustmentStockEvent = async (req) => {
    const destinationParams = {
        stockId: req.body.destinationStockId,
        shelfId: req.body.destinationShelfId,
        productId: req.body.productId
    };

    const destinationInventoryes = await findInventories(req, destinationParams, false, false, false);

    if (destinationInventoryes.length > 1) {
        throw new Error("Multiple destination inventories found");
    }

    if (destinationInventoryes.length === 0) {
        throw new Error("Destination inventory not found");
    }

    if (req.body.quantity < 0) {
        throw new Error("Quantity cannot be negative");
    }

    destinationInventoryes[0].quantity = req.body.quantity;

    if (destinationInventoryes[0].quantity === 0) {
        await destinationInventoryes[0].deleteOne();
    } else {
        await destinationInventoryes[0].save();
    }

};

/**
 * Process a stock event update.
 * @param {Object} req - The request object.
 * @returns  
 */
const processStockEventUpdate = async (req) => {
    switch (req.body.eventType) {
        case StockEventTypes.RECEIPT:
            return processReceiptStockEventUpdate(req);
        case StockEventTypes.ISSUE:
            return processIssueStockEventUpdate(req);
        case StockEventTypes.TRANSFER:
            return processTransferStockEventUpdate(req);
        case StockEventTypes.ADJUSTMENT:
            return processAdjustmentStockEventUpdate(req);
        default:
            throw new Error("Unknown stock event type");
    }
};

/**
 * Process a receipt stock event update.
 * @param {Object} req - The request object.
 * @returns 
 */
const processReceiptStockEventUpdate = async (req) => {
    // TODO: Implement receipt stock event update processing logic
    // For now, just return a success response
    return { success: true, message: "Receipt stock event update processed successfully" };
};

/**
 * Process an issue stock event update.
 * @param {Object} req - The request object.
 * @returns 
 */
const processIssueStockEventUpdate = async (req) => {
    // TODO: Implement issue stock event update processing logic
    // For now, just return a success response
    return { success: true, message: "Issue stock event update processed successfully" };
};

/**
 * Process a transfer stock event update.
 * @param {Object} req - The request object.
 * @returns 
 */
const processTransferStockEventUpdate = async (req) => {
    // TODO: Implement transfer stock event update processing logic
    // For now, just return a success response
    return { success: true, message: "Transfer stock event update processed successfully" };
};

/**
 * Process an adjustment stock event update.
 * @param {Object} req - The request object.
 * @returns 
 */
const processAdjustmentStockEventUpdate = async (req) => {
    // TODO: Implement adjustment stock event update processing logic
    // For now, just return a success response
    return { success: true, message: "Adjustment stock event update processed successfully" };
};





