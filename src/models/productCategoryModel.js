import config from '../config.js';
import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import { log } from "../utils/logger.js";
import { checkUserTenantPermissions, getTenantIdForQuery, getTenantQueryCondition, setTenantForData, toPlainObjectIfLean } from './modelService.js';
import { sanitizeObjectFields } from '../utils/sanitization.js';
import { getRelativePath, convertToBoolean } from '../utils/auxiliary.js';
const relativePath = getRelativePath(import.meta.url);
const protectedModelFields = ['__v'];

const ProductCategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  parentId: { type: Schema.Types.ObjectId, ref: 'ProductCategory' },
  level: { type: Number, default: 0 }, // .env MAX_CATEGORY_DEPTH=3
  active: { type: Boolean, required: true },
  updatedAt: Date,
  createdAt: { type: Date, default: Date.now },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }
});

/**
 * Create a new product category
 * @param {Object} req - The request object
 * @param {Object} categoryData - The category data to create
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object>}
 */
ProductCategorySchema.statics.createCategory = async function (req, categoryData, allTenants = false, sanitize = true, lean = true) {
    log("INFO", `${relativePath}: createCategory(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: createCategory()`);
    categoryData = setTenantForData(req, categoryData, allTenants);
    let newCategory = await this.create(categoryData);
    if (lean) newCategory = newCategory.toObject();
    if (sanitize) newCategory = sanitizeObjectFields(newCategory, protectedModelFields);
    return newCategory;
};

/**
 * Find categories
 * @param {Object} req
 * @param {Object} params
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Array>}
 */
ProductCategorySchema.statics.findCategories = async function (req, params = {}, allTenants = false, sanitize = true, lean = true) {
    log("INFO", `${relativePath}: findCategories(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findCategories()`);
    params.tenant = getTenantIdForQuery(req, params.tenant, allTenants);
    let categories = await this.find(params).lean(lean).exec();
    if (sanitize) categories = categories.map(cat => sanitizeObjectFields(cat, protectedModelFields));
    return categories;
};

/**
 * Find category by ID
 * @param {Object} req
 * @param {string} categoryId
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object|null>}
 */
ProductCategorySchema.statics.findCategoryById = async function (req, categoryId, allTenants = false, sanitize = true, lean = true) {
    log("INFO", `${relativePath}: findCategoryById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findCategoryById()`);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    let category = await this.findOne({ _id: categoryId, ...tenantCondition }).lean(lean).exec();
    if (sanitize) category = sanitizeObjectFields(category, protectedModelFields);
    return category;
};

/**
 * Update category by ID
 * @param {Object} req
 * @param {string} categoryId
 * @param {Object} categoryData
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object|null>}
 */
ProductCategorySchema.statics.updateCategoryById = async function (req, categoryId, categoryData, allTenants = false, sanitize = true, lean = true) {
    log("INFO", `${relativePath}: updateCategoryById(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: updateCategoryById()`);
    let updatedCategory = await this.findByIdAndUpdate(categoryId, categoryData, { new: true }).lean(lean).exec();
    if (sanitize) updatedCategory = sanitizeObjectFields(updatedCategory, protectedModelFields);
    return updatedCategory;
};

/**
 * Delete category by ID
 * @param {Object} req
 * @param {string} categoryId
 * @param {boolean} allTenants
 * @returns {Promise<Object|null>}
 */
ProductCategorySchema.statics.deleteCategoryById = async function (req, categoryId, allTenants = false) {
    log("INFO", `${relativePath}: deleteCategoryById(): allTenants = ${allTenants}`, true, req);
    checkUserTenantPermissions(req, allTenants, `${relativePath}: deleteCategoryById()`);
    return await this.findByIdAndDelete(categoryId);
};

const ProductCategory = mongoose.model('ProductCategory', ProductCategorySchema);
export default ProductCategory;