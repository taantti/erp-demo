import { Product } from '../../../models/index.js';

/**
 * Get all products
 * @param {Object} req - The request object
 * @param {Object} params - Query params
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Array>}
 */
export const readProducts = async (req, params = {}, allTenants = false, sanitize = true, lean = true) => {
    return await Product.findProducts(req, params, allTenants, sanitize, lean);
};

/**
 * Get a product by ID
 * @param {Object} req
 * @param {string} productId
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object|null>}
 */
export const readProduct = async (req, productId, allTenants = false, sanitize = true, lean = true) => {
    return await Product.findProductById(req, productId, allTenants, sanitize, lean);
};

/**
 * Create a new product
 * @param {Object} req
 * @param {Object} productData
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object>}
 */
export const createProduct = async (req, productData, allTenants = false, sanitize = true, lean = true) => {
    return await Product.createProduct(req, productData, allTenants, sanitize, lean);
};

/**
 * Update a product by ID
 * @param {Object} req
 * @param {string} productId
 * @param {Object} productData
 * @param {boolean} allTenants
 * @param {boolean} sanitize
 * @param {boolean} lean
 * @returns {Promise<Object|null>}
 */
export const updateProduct = async (req, productId, productData, allTenants = false, sanitize = true, lean = true) => {
    return await Product.updateProductById(req, productId, productData, allTenants, sanitize, lean);
};

/**
 * Delete a product by ID
 * @param {Object} req
 * @param {string} productId
 * @param {boolean} allTenants
 * @returns {Promise<Object|null>}
 */
export const deleteProduct = async (req, productId, allTenants = false) => {
    return await Product.deleteProductById(req, productId, allTenants);
};
