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


