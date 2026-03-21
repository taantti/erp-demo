import mongoose from 'mongoose';
import { log } from "../utils/logger.js";
import { checkUserTenantPermissions, getTenantIdForQuery, getTenantQueryCondition, setTenantForData, setAutoField, AutoField } from './modelService.js';
import { sanitizeObjectFields } from '../utils/sanitization.js';
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);
const protectedModelFields = ['__v'];

const StockSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 100 },
  location: {
    address: { type: String, maxlength: 200 },
    city: { type: String, maxlength: 100 },
    postalCode: { type: String, maxlength: 20 },
    country: { type: String, maxlength: 100 },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  active: { type: Boolean, default: true },
  manager: { type: String, maxlength: 100 },
  contactInfo: {
    phone: { type: String, maxlength: 30 },
    email: { type: String, maxlength: 80 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }
});

StockSchema.pre('save', async function (next) {
    this.updatedAt = new Date();
    return next();
});

/**
 * Create a new stock.
 * @param {Object} req - The request object.
 * @param {Object} stockData - The stock data to create.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object>} - The created stock object.
 */
export const createStock = async (req, stockData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: createStock(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: createStock()`);
    stockData = setTenantForData(req, stockData, allTenants);
    stockData = setAutoField(req, stockData, AutoField.CREATED_BY);
    let newStock = await new Stock({ ...stockData }).save();
    if (lean) newStock = newStock.toObject();
    if (sanitize) newStock = sanitizeObjectFields(newStock, protectedModelFields);
    return newStock;
};

/**
 * Find stocks based on query parameters.
 * @param {Object} req - The request object.
 * @param {Object} params - The query parameters to filter stocks.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Array>} - Returns an array of stock objects (possibly empty array).
 */
export const findStocks = async (req, params = {}, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findStocks(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findStocks()`);
    params.tenant = getTenantIdForQuery(req, params.tenant, allTenants);
    let stocks = await Stock.find(params).lean(lean).exec();
    if (sanitize) stocks = stocks.map(s => sanitizeObjectFields(s, protectedModelFields));
    return stocks;
};

/**
 * Find a stock by ID.
 * @param {Object} req - The request object.
 * @param {string} stockId - The ID of the stock to find.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The stock object if found, otherwise null.
 */
export const findStockById = async (req, stockId, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findStockById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findStockById()`);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    let stock = await Stock.findOne({ _id: stockId, ...tenantCondition }).lean(lean).exec();
    if (sanitize) stock = sanitizeObjectFields(stock, protectedModelFields);
    return stock;
};

/**
 * Find a stock by ID and update.
 * @param {Object} req - The request object.
 * @param {string} stockId - The ID of the stock to update.
 * @param {Object} stockData - The new data to update the stock with.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The updated stock object if found and updated, otherwise null.
 */
export const updateStockById = async (req, stockId, stockData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: updateStockById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: updateStockById()`);
    stockData = setAutoField(req, stockData, AutoField.UPDATED_BY);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    let updatedStock = await Stock.findOneAndUpdate({ _id: stockId, ...tenantCondition }, stockData, { new: true }).lean(lean).exec();
    if (sanitize) updatedStock = sanitizeObjectFields(updatedStock, protectedModelFields);
    return updatedStock;
};

/**
 * Delete a stock by ID.
 * @param {Object} req - The request object.
 * @param {string} stockId - The ID of the stock to delete.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @returns {Promise<Object|null>} - The deleted stock object if found, otherwise null.
 */
export const deleteStockById = async (req, stockId, allTenants = false) => {
    log("INFO", `${relativePath}: deleteStockById(): allTenants = ${allTenants}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: deleteStockById()`);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    return await Stock.findOneAndDelete({ _id: stockId, ...tenantCondition });
};

export const Stock = mongoose.model('Stock', StockSchema);