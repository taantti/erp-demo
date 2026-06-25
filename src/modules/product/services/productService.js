import { findProducts, findProductById, createProduct as modelCreateProduct, updateProductById, deleteProductById } from '../../../models/index.js';

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<any>}
 */
export const createProduct = async (req, res, next) => {
    try {
        const product = await modelCreateProduct(req, req.body, false, true, true);
        return product;
    } catch (error) {
        return next(error);
    }
};

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<any>}
 */
export const readProduct = async (req, res, next) => {
    try {
        const product = await findProductById(req, req.params.id, false, true, true);
        return product;
    } catch (error) {
        return next(error);
    }
};

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<any>}
 */
export const readProducts = async (req, res, next) => {
    try {
        const products = await findProducts(req, req.query, false, true, true);
        return products;
    } catch (error) {
        return next(error);
    }
};

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<any>}
 */
export const updateProduct = async (req, res, next) => {
    try {
        const product = await updateProductById(req, req.params.id, req.body, false, true, true);
        return product;
    } catch (error) {
        return next(error);
    }
};

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<any>}
 */
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await deleteProductById(req, req.params.id, false);
        return product;
    } catch (error) {
        return next(error);
    }
};
