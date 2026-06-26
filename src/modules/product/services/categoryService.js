import { findCategories, findCategoryById, createCategory as modelCreateCategory, updateCategoryById, deleteCategoryById } from '../../../models/index.js';

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const createCategory = async (req) => {
    return await modelCreateCategory(req, req.body, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readCategory = async (req) => {
    return await findCategoryById(req, req.params.id, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readCategories = async (req) => {
    return await findCategories(req, req.query, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const updateCategory = async (req) => {
    return await updateCategoryById(req, req.params.id, req.body, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const deleteCategory = async (req) => {
    return await deleteCategoryById(req, req.params.id, false);
};
