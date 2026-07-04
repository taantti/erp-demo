import express from 'express';
import {
    readSaleOrders, readSaleOrder, createSaleOrder, updateSaleOrder, deleteSaleOrder,
    readItems, readItem, createItem, updateItem, deleteItem
} from '../modules/saleOrder/saleOrderController.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

// Sale order item routes (must be before /:id to avoid 'item' matching as an id)

/**
 * @swagger
 * /sale-order/{id}/item:
 *   get:
 *     summary: Get all items of a sale order
 *     description: Retrieve the embedded items of a sale order within the caller's tenant.
 *     tags: [Sale Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale order ObjectId
 *     responses:
 *       200:
 *         description: Array of sale order items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SaleOrderItem'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/item', authorizationMiddleware('saleOrder', 'readSaleOrderItems'), readItems);

/**
 * @swagger
 * /sale-order/{id}/item:
 *   post:
 *     summary: Add an item to a sale order
 *     description: Append a new embedded item to a sale order within the caller's tenant.
 *     tags: [Sale Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale order ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleOrderItemCreate'
 *     responses:
 *       201:
 *         description: The created item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleOrderItem'
 *       400:
 *         description: Bad request - validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Sale order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/item', authorizationMiddleware('saleOrder', 'createSaleOrderItem'), createItem);

/**
 * @swagger
 * /sale-order/{id}/item/{itemId}:
 *   get:
 *     summary: Get a sale order item by ID
 *     description: Retrieve a single embedded item from a sale order.
 *     tags: [Sale Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale order ObjectId
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ObjectId
 *     responses:
 *       200:
 *         description: The sale order item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleOrderItem'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Sale order or item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/item/:itemId', authorizationMiddleware('saleOrder', 'readSaleOrderItem'), readItem);

/**
 * @swagger
 * /sale-order/{id}/item/{itemId}:
 *   put:
 *     summary: Update a sale order item
 *     description: Update a single embedded item in a sale order.
 *     tags: [Sale Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale order ObjectId
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleOrderItemCreate'
 *     responses:
 *       200:
 *         description: The updated item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleOrderItem'
 *       400:
 *         description: Bad request - validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Sale order or item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/item/:itemId', authorizationMiddleware('saleOrder', 'updateSaleOrderItem'), updateItem);

/**
 * @swagger
 * /sale-order/{id}/item/{itemId}:
 *   delete:
 *     summary: Delete a sale order item
 *     description: Remove a single embedded item from a sale order.
 *     tags: [Sale Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale order ObjectId
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ObjectId
 *     responses:
 *       200:
 *         description: Item deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Sale order or item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id/item/:itemId', authorizationMiddleware('saleOrder', 'deleteSaleOrderItem'), deleteItem);

// Sale order routes

/**
 * @swagger
 * /sale-order:
 *   get:
 *     summary: Get all sale orders
 *     description: Retrieve all sale orders within the caller's tenant. Supports query parameter filtering.
 *     tags: [Sale Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orderNumber
 *         schema:
 *           type: string
 *         description: Filter by order number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, ordered, partially_send, send, cancelled]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Array of sale orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SaleOrder'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authorizationMiddleware('saleOrder', 'readSaleOrders'), readSaleOrders);

/**
 * @swagger
 * /sale-order:
 *   post:
 *     summary: Create a new sale order
 *     description: Create a sale order (with optional embedded items) within the caller's tenant.
 *     tags: [Sale Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleOrderCreate'
 *     responses:
 *       201:
 *         description: The created sale order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleOrder'
 *       400:
 *         description: Bad request - validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authorizationMiddleware('saleOrder', 'createSaleOrder'), createSaleOrder);

/**
 * @swagger
 * /sale-order/{id}:
 *   get:
 *     summary: Get a sale order by ID
 *     description: Retrieve a single sale order within the caller's tenant.
 *     tags: [Sale Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale order ObjectId
 *     responses:
 *       200:
 *         description: The sale order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleOrder'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Sale order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authorizationMiddleware('saleOrder', 'readSaleOrder'), readSaleOrder);

/**
 * @swagger
 * /sale-order/{id}:
 *   put:
 *     summary: Update a sale order
 *     description: Update a sale order within the caller's tenant.
 *     tags: [Sale Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale order ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleOrderUpdate'
 *     responses:
 *       200:
 *         description: The updated sale order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleOrder'
 *       400:
 *         description: Bad request - validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Sale order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authorizationMiddleware('saleOrder', 'updateSaleOrder'), updateSaleOrder);

/**
 * @swagger
 * /sale-order/{id}:
 *   delete:
 *     summary: Delete a sale order
 *     description: Delete a sale order within the caller's tenant.
 *     tags: [Sale Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale order ObjectId
 *     responses:
 *       200:
 *         description: Sale order deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Sale order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authorizationMiddleware('saleOrder', 'deleteSaleOrder'), deleteSaleOrder);

export default router;
