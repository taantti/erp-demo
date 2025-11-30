import express from 'express';
import { readProducts, readProduct, createProduct, updateProduct, deleteProduct, readCategories, readCategory, createCategory, updateCategory, deleteCategory } from '../modules/product/productController.js';
import { authenticationMiddleware } from '../middleware/authenticationMiddleware.js';
import { authorizationMiddleware } from '../middleware/authorizationMiddleware.js';

const router = express.Router();

// Product routes
router.get('/products', authenticationMiddleware, authorizationMiddleware('product', 'readProducts'), readProducts);
router.get('/products/:id', authenticationMiddleware, authorizationMiddleware('product', 'readProduct'), readProduct);
router.post('/products', authenticationMiddleware, authorizationMiddleware('product', 'createProduct'), createProduct);
router.put('/products/:id', authenticationMiddleware, authorizationMiddleware('product', 'updateProduct'), updateProduct);
router.delete('/products/:id', authenticationMiddleware, authorizationMiddleware('product', 'deleteProduct'), deleteProduct);

// Category routes
router.get('/products/category', authenticationMiddleware, authorizationMiddleware('category', 'readCategories'), readCategories);
router.get('/products/category/:id', authenticationMiddleware, authorizationMiddleware('category', 'readCategory'), readCategory);
router.post('/products/category', authenticationMiddleware, authorizationMiddleware('category', 'createCategory'), createCategory);
router.put('/products/category/:id', authenticationMiddleware, authorizationMiddleware('category', 'updateCategory'), updateCategory);
router.delete('/products/category/:id', authenticationMiddleware, authorizationMiddleware('category', 'deleteCategory'), deleteCategory);

export default router;
