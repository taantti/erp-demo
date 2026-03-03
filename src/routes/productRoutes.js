import express from 'express';
import { readProducts, readProduct, createProduct, updateProduct, deleteProduct, readCategories, readCategory, createCategory, updateCategory, deleteCategory } from '../modules/product/productController.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

// Category routes (must be before /:id to avoid 'category' matching as an id)
/**
 * @swagger 
 */
router.get('/category', authorizationMiddleware('category', 'readCategories'), readCategories);

/**
 * @swagger 
 */
router.get('/category/:id', authorizationMiddleware('category', 'readCategory'), readCategory);

/**
 * @swagger 
 */
router.post('/category', authorizationMiddleware('category', 'createCategory'), createCategory);

/**
 * @swagger 
 */
router.put('/category/:id', authorizationMiddleware('category', 'updateCategory'), updateCategory);

/**
 * @swagger 
 */
router.delete('/category/:id', authorizationMiddleware('category', 'deleteCategory'), deleteCategory);

// Product routes
/**
 * @swagger 
 */
router.get('/', authorizationMiddleware('product', 'readProducts'), readProducts);

/**
 * @swagger 
 */
router.get('/:id', authorizationMiddleware('product', 'readProduct'), readProduct);

/**
 * @swagger 
 */
router.post('/', authorizationMiddleware('product', 'createProduct'), createProduct);

/**
 * @swagger 
 */
router.put('/:id', authorizationMiddleware('product', 'updateProduct'), updateProduct);

/**
 * @swagger 
 */
router.delete('/:id', authorizationMiddleware('product', 'deleteProduct'), deleteProduct);

export default router;
