import mongoose from 'mongoose';
import { log } from "../utils/logger.js";
import { checkUserTenantPermissions, getTenantIdForQuery, getTenantQueryCondition, setTenantForData, setAutoField, AutoField } from './modelService.js';
import { sanitizeObjectFields } from '../utils/sanitization.js';
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);
const protectedModelFields = ['__v'];

/**
 * Stock event types
 * RECEIPT: A new stock entry (e.g., purchase order received)
 * ISSUE: A stock exit (e.g., sales order fulfilled)
 * TRANSFER: A stock transfer between shelves or locations
 * ADJUSTMENT: A stock adjustment (e.g., inventory count)
 */
export const StockEventTypes = {
   RECEIPT: 'receipt',
   ISSUE: 'issue',
   TRANSFER: 'transfer',
   ADJUSTMENT: 'adjustment',
};

const StockEventSchema = new mongoose.Schema({
    eventType: { type: String, enum: Object.values(StockEventTypes), required: true },
    sourceStockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
    sourceShelfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelf' },
    destinationStockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
    destinationShelfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelf' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    purchaseOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' },
    reference: { type: String, maxlength: 200 },
    notes: { type: String, maxlength: 500 },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }
});

/**
 * Create a new stock event.
 * @param {Object} req - The request object.
 * @param {Object} eventData - The stock event data to create.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object>} - The created stock event object.
 */
export const createStockEvent = async (req, eventData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: createStockEvent(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: createStockEvent()`);
    eventData = setTenantForData(req, eventData, allTenants);
    eventData = setAutoField(req, eventData, AutoField.PERFORMED_BY);
    let newEvent = await new StockEvent({ ...eventData }).save();
    if (lean) newEvent = newEvent.toObject();
    if (sanitize) newEvent = sanitizeObjectFields(newEvent, protectedModelFields);
    return newEvent;
};

/**
 * Find stock events based on query parameters.
 * @param {Object} req - The request object.
 * @param {Object} params - The query parameters to filter stock events.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Array>} - Returns an array of stock event objects (possibly empty array).
 */
export const findStockEvents = async (req, params = {}, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findStockEvents(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findStockEvents()`);
    params.tenant = getTenantIdForQuery(req, params.tenant, allTenants);
    let events = await StockEvent.find(params).lean(lean).exec();
    if (sanitize) events = events.map(e => sanitizeObjectFields(e, protectedModelFields));
    return events;
};

/**
 * Find a stock event by ID.
 * @param {Object} req - The request object.
 * @param {string} eventId - The ID of the stock event to find.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The stock event object if found, otherwise null.
 */
export const findStockEventById = async (req, eventId, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findStockEventById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findStockEventById()`);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    let event = await StockEvent.findOne({ _id: eventId, ...tenantCondition }).lean(lean).exec();
    if (sanitize) event = sanitizeObjectFields(event, protectedModelFields);
    return event;
};

/**
 * Find a stock event by ID and update.
 * @param {Object} req - The request object.
 * @param {string} eventId - The ID of the stock event to update.
 * @param {Object} eventData - The new data to update the stock event with.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The updated stock event object if found and updated, otherwise null.
 */
export const updateStockEventById = async (req, eventId, eventData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: updateStockEventById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: updateStockEventById()`);
    eventData = setAutoField(req, eventData, AutoField.UPDATED_BY);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    let updatedEvent = await StockEvent.findOneAndUpdate({ _id: eventId, ...tenantCondition }, eventData, { new: true }).lean(lean).exec();
    if (sanitize) updatedEvent = sanitizeObjectFields(updatedEvent, protectedModelFields);
    return updatedEvent;
};

/**
 * Delete a stock event by ID.
 * @param {Object} req - The request object.
 * @param {string} eventId - The ID of the stock event to delete.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @returns {Promise<Object|null>} - The deleted stock event object if found, otherwise null.
 */
export const deleteStockEventById = async (req, eventId, allTenants = false) => {
    log("INFO", `${relativePath}: deleteStockEventById(): allTenants = ${allTenants}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: deleteStockEventById()`);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    return await StockEvent.findOneAndDelete({ _id: eventId, ...tenantCondition });
};

export const StockEvent = mongoose.model('StockEvent', StockEventSchema);