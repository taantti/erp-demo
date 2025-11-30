import { ProductCategory } from '../../../models/index.js';

/**
 * Get all categories
 * @param {Object} req - The request object
 * @param {Object} params - Query params
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Array>}
 */
export const readCategories = async (req, params = {}, allTenants = false, sanitize = true, lean = true) => {
    return await ProductCategory.findCategories(req, params, allTenants, sanitize, lean);
};

/**
 * Get a category by ID
 * @param {Object} req
 * @param {string} categoryId
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object|null>}
 */
export const readCategory = async (req, categoryId, allTenants = false, sanitize = true, lean = true) => {
    return await ProductCategory.findCategoryById(req, categoryId, allTenants, sanitize, lean);
};

/**
 * Create a new category
 * @param {Object} req
 * @param {Object} categoryData
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object>}
 */
export const createCategory = async (req, categoryData, allTenants = false, sanitize = true, lean = true) => {
    return await ProductCategory.createCategory(req, categoryData, allTenants, sanitize, lean);
};

/**
 * Update a category by ID
 * @param {Object} req
 * @param {string} categoryId
 * @param {Object} categoryData
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object|null>}
 */
export const updateCategory = async (req, categoryId, categoryData, allTenants = false, sanitize = true, lean = true) => {
    return await ProductCategory.updateCategoryById(req, categoryId, categoryData, allTenants, sanitize, lean);
};

/**
 * Delete a category by ID
 * @param {Object} req
 * @param {string} categoryId
 * @param {boolean} allTenants
 * @returns {Promise<Object|null>}
 */
export const deleteCategory = async (req, categoryId, allTenants = false) => {
    return await ProductCategory.deleteCategoryById(req, categoryId, allTenants);
};
