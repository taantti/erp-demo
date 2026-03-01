import { findCategories, findCategoryById, createCategory as modelCreateCategory, updateCategoryById, deleteCategoryById } from '../../../models/index.js';
import { log } from '../../../utils/logger.js';
import { getRelativePath } from '../../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

export const createCategory = async (req, res, next) => {
    log("INFO", `${relativePath}: createCategory(): `, true, req);
    try {
        const category = await modelCreateCategory(req, req.body, false, true, true);
        return category;
    } catch (error) {
        return next(error);
    }
};

export const readCategory = async (req, res, next) => {
    log("INFO", `${relativePath}: readCategory(${req.params.id}): `, true, req);
    try {
        const category = await findCategoryById(req, req.params.id, false, true, true);
        return category;
    } catch (error) {
        return next(error);
    }
};

export const readCategories = async (req, res, next) => {
    log("INFO", `${relativePath}: readCategories(): `, true, req);
    try {
        const categories = await findCategories(req, req.query, false, true, true);
        return categories;
    } catch (error) {
        return next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    log("INFO", `${relativePath}: updateCategory(${req.params.id}): `, true, req);
    try {
        const category = await updateCategoryById(req, req.params.id, req.body, false, true, true);
        return category;
    } catch (error) {
        return next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteCategory(${req.params.id}): `, true, req);
    try {
        const category = await deleteCategoryById(req, req.params.id, false);
        return category;
    } catch (error) {
        return next(error);
    }
};
