import { findProducts, findProductById, createProduct as modelCreateProduct, updateProductById, deleteProductById } from '../../../models/index.js';

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const createProduct = async (req) => {
    return await modelCreateProduct(req, req.body, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readProduct = async (req) => {
    return await findProductById(req, req.params.id, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readProducts = async (req) => {
    return await findProducts(req, req.query, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const updateProduct = async (req) => {
    return await updateProductById(req, req.params.id, req.body, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const deleteProduct = async (req) => {
    return await deleteProductById(req, req.params.id, false);
};
