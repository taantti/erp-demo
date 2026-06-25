import { findCategories, findCategoryById, createCategory as modelCreateCategory, updateCategoryById, deleteCategoryById } from '../../../models/index.js';

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<any>}
 */
export const createCategory = async (req, res, next) => {
    try {
        const category = await modelCreateCategory(req, req.body, false, true, true);
        return category;
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
export const readCategory = async (req, res, next) => {
    try {
        const category = await findCategoryById(req, req.params.id, false, true, true);
        return category;
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
export const readCategories = async (req, res, next) => {
    try {
        const categories = await findCategories(req, req.query, false, true, true);
        return categories;
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
export const updateCategory = async (req, res, next) => {
    try {
        const category = await updateCategoryById(req, req.params.id, req.body, false, true, true);
        return category;
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
export const deleteCategory = async (req, res, next) => {
    try {
        const category = await deleteCategoryById(req, req.params.id, false);
        return category;
    } catch (error) {
        return next(error);
    }
};
