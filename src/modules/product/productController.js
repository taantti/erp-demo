import { productService, categoryService } from './services/index.js';
import { log } from '../../utils/logger.js';
import { getRelativePath } from '../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

export const readProducts = async (req, res, next) => {
    log("INFO", `${relativePath}: readProducts(): `, true, req);
    try {
        const products = await productService.readProducts(req, res, next);
        res.status(200).json(products);
    } catch (error) {
        return next(error);
    }
};

export const readProduct = async (req, res, next) => {
    log("INFO", `${relativePath}: readProduct(): `, true, req);
    try {
        const product = await productService.readProduct(req, res, next);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        return next(error);
    }
};

export const createProduct = async (req, res, next) => {
    log("INFO", `${relativePath}: createProduct(): `, true, req);
    try {
        const newProduct = await productService.createProduct(req, res, next);
        if (!newProduct) return res.status(400).json({ error: 'Product not created' });
        res.status(201).json(newProduct);
    } catch (error) {
        return next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    log("INFO", `${relativePath}: updateProduct(): `, true, req);
    try {
        const updatedProduct = await productService.updateProduct(req, res, next);
        if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(updatedProduct);
    } catch (error) {
        return next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteProduct(): `, true, req);
    try {
        const deletedProduct = await productService.deleteProduct(req, res, next);
        if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json({ msg: 'Product deleted' });
    } catch (error) {
        return next(error);
    }
};

export const readCategories = async (req, res, next) => {
    log("INFO", `${relativePath}: readCategories(): `, true, req);
    try {
        const categories = await categoryService.readCategories(req, res, next);
        res.status(200).json(categories);
    } catch (error) {
        return next(error);
    }
};

export const readCategory = async (req, res, next) => {
    log("INFO", `${relativePath}: readCategory(): `, true, req);
    try {
        const category = await categoryService.readCategory(req, res, next);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        return next(error);
    }
};

export const createCategory = async (req, res, next) => {
    log("INFO", `${relativePath}: createCategory(): `, true, req);
    try {
        const newCategory = await categoryService.createCategory(req, res, next);
        if (!newCategory) return res.status(400).json({ error: 'Category not created' });
        res.status(201).json(newCategory);
    } catch (error) {
        return next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    log("INFO", `${relativePath}: updateCategory(): `, true, req);
    try {
        const updatedCategory = await categoryService.updateCategory(req, res, next);
        if (!updatedCategory) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(updatedCategory);
    } catch (error) {
        return next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteCategory(): `, true, req);
    try {
        const deletedCategory = await categoryService.deleteCategory(req, res, next);
        if (!deletedCategory) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json({ msg: 'Category deleted' });
    } catch (error) {
        return next(error);
    }
};
























