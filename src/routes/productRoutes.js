import express from 'express';
import { readProducts, readProduct, createProduct, updateProduct, deleteProduct, readCategories, readCategory, createCategory, updateCategory, deleteCategory } from '../modules/product/productController.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

// Category routes (must be before /:id to avoid 'category' matching as an id)
/**
 * @swagger 
 * /product/category:
 *   get:
 *     summary: Get all categories
 *     description: Get all categories
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       active:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 */
router.get('/category', authorizationMiddleware('category', 'readCategories'), readCategories);

/**
 * @swagger 
 * /product/category/{id}:
 *   get:
 *     summary: Get category by id
 *     description: Get category by id
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     active:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 */
router.get('/category/:id', authorizationMiddleware('category', 'readCategory'), readCategory);

/**
 * @swagger 
 * /product/category:
 *   post:
 *     summary: Create category
 *     description: Create category
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     active:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 */
router.post('/category', authorizationMiddleware('category', 'createCategory'), createCategory);

/**
 * @swagger 
 * /product/category/{id}:
 *   put:
 *     summary: Update category
 *     description: Update category
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     active:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 */
router.put('/category/:id', authorizationMiddleware('category', 'updateCategory'), updateCategory);

/**
 * @swagger 
 * /product/category/{id}:
 *   delete:
 *     summary: Delete category
 *     description: Delete category
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/category/:id', authorizationMiddleware('category', 'deleteCategory'), deleteCategory);

// Product routes
/**
 * @swagger 
 * /product:
 *   get:
 *     summary: Get all products
 *     description: Get all products
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       category:
 *                         type: string
 *                       active:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 */
router.get('/', authorizationMiddleware('product', 'readProducts'), readProducts);

/**
 * @swagger 
 * /product/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Get product by ID
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id', authorizationMiddleware('product', 'readProduct'), readProduct);

/**
 * @swagger 
 * /product:
 *   post:
 *     summary: Create product
 *     description: Create product
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', authorizationMiddleware('product', 'createProduct'), createProduct);

/**
 * @swagger 
 * /product/{id}:
 *   put:
 *     summary: Update product
 *     description: Update product
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:id', authorizationMiddleware('product', 'updateProduct'), updateProduct);

/**
 * @swagger 
 * /product/{id}:
 *   delete:
 *     summary: Delete product
 *     description: Delete product
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/:id', authorizationMiddleware('product', 'deleteProduct'), deleteProduct);

export default router;
