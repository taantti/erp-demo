import { StockEventTypes } from '../models/stockEventModel.js';
import { log } from './logger.js';
import { getRelativePath } from './auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

/**
 * Validate an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
export const validateEmail = function (email) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
};

/**
 * Validate a stock event.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns 
 */
export const validateStockEvent = (req, res, next) => {
    log("INFO", `${relativePath}: validateStockEvent(): `, true, req);

    if (!validateStockEventTypes(req.body.eventType)) {
        return next(new Error("Invalid stock event type"));
    }

    if (!req.body.productId) {
        return next(new Error("Product ID is required"));
    }

    if (!req.body.quantity) {
        return next(new Error("Quantity is required"));
    }

    if(typeof req.body.quantity !== "number") {
        return next(new Error("Quantity must be a number"));
    }

    let error = null;

    switch (req.body.eventType) {
        case StockEventTypes.RECEIPT:
            error = validateReceiptStockEvent(req);
            break;
        case StockEventTypes.ISSUE:
            error = validateIssueStockEvent(req);
            break;
        case StockEventTypes.TRANSFER:
            error = validateTransferStockEvent(req);
            break;
        case StockEventTypes.ADJUSTMENT:
            error = validateAdjustmentStockEvent(req);
            break;
        default:
            return next(new Error("Invalid stock event type"));
    }

    if (error) {
        return next(new Error(error));
    }

    return next();
};


/**
 * Validate stock event types.
 * @param {string} eventType - The stock event type to validate.
 * @returns {boolean} - True if the stock event type is valid, false otherwise.
 */
const validateStockEventTypes = (eventType) => {
    return Object.values(StockEventTypes).includes(eventType);
};

/**
 * Validate a receipt stock event.
 * @param {Object} req - The request object.
 * @returns {string|null} - Error message or null if valid.
 */
const validateReceiptStockEvent = (req) => {
    if (!req.body.purchaseOrderId) {
        return "Purchase order ID is required for receipt events";
    }

    if (!req.body.destinationStockId) {
        return "Destination stock ID is required for receipt events";
    }

    if (!req.body.destinationShelfId) {
        return "Destination shelf ID is required for receipt events";
    }

    return null;
};

/**
 * Validate an issue stock event.
 * @param {Object} req - The request object.
 * @returns {string|null} - Error message or null if valid.
 */
const validateIssueStockEvent = (req) => {
    if (!req.body.sourceStockId) {
        return "Source stock ID is required for issue events";
    }

    if (!req.body.sourceShelfId) {
        return "Source shelf ID is required for issue events";
    }

    return null;
};

/**
 * Validate a transfer stock event.
 * @param {Object} req - The request object.
 * @returns {string|null} - Error message or null if valid.
 */
const validateTransferStockEvent = (req) => {
    if (!req.body.sourceStockId) {
        return "Source stock ID is required for transfer events";
    }

    if (!req.body.sourceShelfId) {
        return "Source shelf ID is required for transfer events";
    }

    if (!req.body.destinationStockId) {
        return "Destination stock ID is required for transfer events";
    }

    if (!req.body.destinationShelfId) {
        return "Destination shelf ID is required for transfer events";
    }

    return null;
};

/**
 * Validate an adjustment stock event.
 * @param {Object} req - The request object.
 * @returns {string|null} - Error message or null if valid.
 */
const validateAdjustmentStockEvent = (req) => {
    if (!req.body.destinationStockId) {
        return "Destination stock ID is required for adjustment events";
    }

    if (!req.body.destinationShelfId) {
        return "Destination shelf ID is required for adjustment events";
    }

    return null;
};
