import { findProducts, findProductById, createProduct as modelCreateProduct, updateProductById, deleteProductById } from '../../../models/index.js';
import { log } from '../../../utils/logger.js';
import { getRelativePath } from '../../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

export const createProduct = async (req, res, next) => {
    log("INFO", `${relativePath}: createProduct(): `, true, req);
    try {
        const product = await modelCreateProduct(req, req.body, false, true, true);
        return product;
    } catch (error) {
        return next(error);
    }
};

export const readProduct = async (req, res, next) => {
    log("INFO", `${relativePath}: readProduct(${req.params.id}): `, true, req);
    try {
        const product = await findProductById(req, req.params.id, false, true, true);
        return product;
    } catch (error) {
        return next(error);
    }
};

export const readProducts = async (req, res, next) => {
    log("INFO", `${relativePath}: readProducts(): `, true, req);
    try {
        const products = await findProducts(req, req.query, false, true, true);
        return products;
    } catch (error) {
        return next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    log("INFO", `${relativePath}: updateProduct(${req.params.id}): `, true, req);
    try {
        const product = await updateProductById(req, req.params.id, req.body, false, true, true);
        return product;
    } catch (error) {
        return next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteProduct(${req.params.id}): `, true, req);
    try {
        const product = await deleteProductById(req, req.params.id, false);
        return product;
    } catch (error) {
        return next(error);
    }
};
