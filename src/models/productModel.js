import config from './../config.js';
import mongoose from 'mongoose';
import bcrypt from "bcrypt";
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

const ProductSchema = new Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  unit: { type: String, enum: Object.values(ProductUnits), required: true },
  description: { type: String },
  categoryIds: [{ type: Schema.Types.ObjectId, ref: 'ProductCategory' }],
  netPrice: { type: Number },
  grossPrice: { type: Number },
  vatRate: { type: Number },
  active: { type: Boolean, required: true },
  updatedAt: Date,
  createdAt: { type: Date, default: Date.now },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }
});

/**
 * Create a new product
 * @param {Object} req - The request object
 * @param {Object} productData - The product data to create
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object>}
 */
ProductSchema.statics.createProduct = async function (req, productData, allTenants = false, sanitize = true, lean = true) {
    log("INFO", `${relativePath}: createProduct(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: createProduct()`);
    productData = setTenantForData(req, productData, allTenants);
    let newProduct = await this.create(productData);
    if (lean) newProduct = newProduct.toObject();
    if (sanitize) newProduct = sanitizeObjectFields(newProduct, protectedModelFields);
    return newProduct;
};

/**
 * Find products
 * @param {Object} req
 * @param {Object} params
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Array>}
 */
ProductSchema.statics.findProducts = async function (req, params = {}, allTenants = false, sanitize = true, lean = true) {
    log("INFO", `${relativePath}: findProducts(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findProducts()`);
    params.tenant = getTenantIdForQuery(req, params.tenant, allTenants);
    let products = await this.find(params).lean(lean).exec();
    if (sanitize) products = products.map(prod => sanitizeObjectFields(prod, protectedModelFields));
    return products;
};

/**
 * Find product by ID
 * @param {Object} req
 * @param {string} productId
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object|null>}
 */
ProductSchema.statics.findProductById = async function (req, productId, allTenants = false, sanitize = true, lean = true) {
    log("INFO", `${relativePath}: findProductById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findProductById()`);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    let product = await this.findOne({ _id: productId, ...tenantCondition }).lean(lean).exec();
    if (sanitize) product = sanitizeObjectFields(product, protectedModelFields);
    return product;
};

/**
 * Update product by ID
 * @param {Object} req
 * @param {string} productId
 * @param {Object} productData
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object|null>}
 */
ProductSchema.statics.updateProductById = async function (req, productId, productData, allTenants = false, sanitize = true, lean = true) {
    log("INFO", `${relativePath}: updateProductById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: updateProductById()`);
    let updatedProduct = await this.findByIdAndUpdate(productId, productData, { new: true }).lean(lean).exec();
    if (sanitize) updatedProduct = sanitizeObjectFields(updatedProduct, protectedModelFields);
    return updatedProduct;
};

/**
 * Delete product by ID
 * @param {Object} req
 * @param {string} productId
 * @param {boolean} allTenants
 * @returns {Promise<Object|null>}
 */
ProductSchema.statics.deleteProductById = async function (req, productId, allTenants = false) {
    log("INFO", `${relativePath}: deleteProductById(): allTenants = ${allTenants}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: deleteProductById()`);
    return await this.findByIdAndDelete(productId);
};

const Product = mongoose.model('Product', ProductSchema);
export default Product;