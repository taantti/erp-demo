import config from './../config.js';
import mongoose from 'mongoose';
import { log } from "../utils/logger.js";
import { checkUserTenantPermissions, getTenantIdForQuery, getTenantQueryCondition, setTenantForData, toPlainObjectIfLean } from './modelService.js';
import { sanitizeObjectFields } from '../utils/sanitization.js';
import { getRelativePath, convertToBoolean } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);
const protectedModelFields = ['__v'];

export const ProductUnits = {
    PIECE: "piece",
    KILOGRAM: "kilogram",
    GRAM: "gram",
    LITER: "liter",
    METER: "meter",
    CENTIMETER: "centimeter",
    MILLIMETER: "millimeter",
    BOX: "box",
    NO_UNIT: "no unit"
};

/**
 * Product Schema
 * @typedef {Object} Product
 * @property {string} name
 * @property {string} sku
 * @property {string} unit
 * @property {string} description
 * @property {Array<ObjectId>} categoryIds
 * @property {number} netPrice
 * @property {number} grossPrice
 * @property {number} vatRate
 * @property {boolean} active
 * @property {Date} updatedAt
 * @property {Date} createdAt
 * @property {ObjectId} tenant
 */
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    unit: { type: String, enum: Object.values(ProductUnits), required: true },
    description: { type: String },
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' }],
    netPrice: { type: Number },
    grossPrice: { type: Number },
    vatRate: { type: Number },
    active: { type: Boolean, required: true },
    updatedAt: Date,
    createdAt: { type: Date, default: Date.now },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }
});

/**
 * Create a new product.
 * @param {Object} req - Request object
 * @param {Object} productData - Product data
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object>}
 */
export const createProduct = async (req, productData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: createProduct(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: createProduct()`);
    productData = setTenantForData(req, productData, allTenants);
    let newProduct = await new Product({ ...productData }).save();
    if (lean) newProduct = newProduct.toObject();
    if (sanitize) newProduct = sanitizeObjectFields(newProduct, protectedModelFields);
    return newProduct;
};

/**
 * Find products.
 * @param {Object} req
 * @param {Object} params
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Array>}
 */
export const findProducts = async (req, params = {}, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findProducts(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findProducts()`);
    params.tenant = getTenantIdForQuery(req, params.tenant, allTenants);
    let products = await Product.find(params).lean(lean).exec();
    if (sanitize) products = products.map(prod => sanitizeObjectFields(prod, protectedModelFields));
    return products;
};

/**
 * Find product by ID.
 * @param {Object} req
 * @param {string} productId
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object|null>}
 */
export const findProductById = async (req, productId, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findProductById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findProductById()`);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    let product = await Product.findOne({ _id: productId, ...tenantCondition }).lean(lean).exec();
    if (sanitize) product = sanitizeObjectFields(product, protectedModelFields);
    return product;
};

/**
 * Update product by ID.
 * @param {Object} req
 * @param {string} productId
 * @param {Object} productData
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object|null>}
 */
export const updateProductById = async (req, productId, productData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: updateProductById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: updateProductById()`);
    let updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true }).lean(lean).exec();
    if (sanitize) updatedProduct = sanitizeObjectFields(updatedProduct, protectedModelFields);
    return updatedProduct;
};

/**
 * Delete product by ID.
 * @param {Object} req
 * @param {string} productId
 * @param {boolean} allTenants
 * @returns {Promise<Object|null>}
 */
export const deleteProductById = async (req, productId, allTenants = false) => {
    log("INFO", `${relativePath}: deleteProductById(): allTenants = ${allTenants}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: deleteProductById()`);
    return await Product.findByIdAndDelete(productId);
};

ProductSchema.pre('save', async function (next) {
    this.updatedAt = new Date();
    return next();
});

export default mongoose.model('Product', ProductSchema);