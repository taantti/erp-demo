import { productService, categoryService } from './services/index.js';

/**
 * Read all products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readProducts = async (req, res, next) => {
    try {
        const products = await productService.readProducts(req, res, next);
        res.status(200).json(products);
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a single product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readProduct = async (req, res, next) => {
    try {
        const product = await productService.readProduct(req, res, next);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        return next(error);
    }
};

/**
 * Create a new product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createProduct = async (req, res, next) => {
    try {
        const newProduct = await productService.createProduct(req, res, next);
        if (!newProduct) return res.status(400).json({ error: 'Product not created' });
        res.status(201).json(newProduct);
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await productService.updateProduct(req, res, next);
        if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(updatedProduct);
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await productService.deleteProduct(req, res, next);
        if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json({ msg: 'Product deleted' });
    } catch (error) {
        return next(error);
    }
};

/**
 * Read all categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.readCategories(req, res, next);
        res.status(200).json(categories);
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a single category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readCategory = async (req, res, next) => {
    try {
        const category = await categoryService.readCategory(req, res, next);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        return next(error);
    }
};

/**
 * Create a new category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createCategory = async (req, res, next) => {
    try {
        const newCategory = await categoryService.createCategory(req, res, next);
        if (!newCategory) return res.status(400).json({ error: 'Category not created' });
        res.status(201).json(newCategory);
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateCategory = async (req, res, next) => {
    try {
        const updatedCategory = await categoryService.updateCategory(req, res, next);
        if (!updatedCategory) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(updatedCategory);
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteCategory = async (req, res, next) => {
    try {
        const deletedCategory = await categoryService.deleteCategory(req, res, next);
        if (!deletedCategory) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json({ msg: 'Category deleted' });
    } catch (error) {
        return next(error);
    }
};
