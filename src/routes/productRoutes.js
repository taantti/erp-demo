import express from 'express';
import { readProducts, readProduct, createProduct, updateProduct, deleteProduct, readCategories, readCategory, createCategory, updateCategory, deleteCategory } from '../modules/product/productController.js';
//import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

// Product routes
router.get('/', authorizationMiddleware('product', 'readProducts'), readProducts);
router.get('/:id', authorizationMiddleware('product', 'readProduct'), readProduct);
router.post('/', authorizationMiddleware('product', 'createProduct'), createProduct);
router.put('/:id', authorizationMiddleware('product', 'updateProduct'), updateProduct);
router.delete('/:id', authorizationMiddleware('product', 'deleteProduct'), deleteProduct);

// Category routes
router.get('/category', authorizationMiddleware('category', 'readCategories'), readCategories);
router.get('/category/:id', authorizationMiddleware('category', 'readCategory'), readCategory);
router.post('/category', authorizationMiddleware('category', 'createCategory'), createCategory);
router.put('/category/:id', authorizationMiddleware('category', 'updateCategory'), updateCategory);
router.delete('/category/:id', authorizationMiddleware('category', 'deleteCategory'), deleteCategory);

export default router;
