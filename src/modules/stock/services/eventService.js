import { StockEventTypes } from '../../../models/stockEventModel.js';
import { findStockEvents, findStockEventById, createStockEvent as modelCreateStockEvent, updateStockEventById, deleteStockEventById } from '../../../models/index.js';
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
 * @returns 
 */
const processTransferStockEvent = async (req) => {
    // TODO: Implement transfer stock event processing logic
    // For now, just return a success response
    return { success: true, message: "Transfer stock event processed successfully" };
};

/**
 * Process an adjustment stock event.
 * @param {Object} req - The request object.
 * @returns 
 */
const processAdjustmentStockEvent = async (req) => {
    // TODO: Implement adjustment stock event processing logic
    // For now, just return a success response
    return { success: true, message: "Adjustment stock event processed successfully" };
};

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





