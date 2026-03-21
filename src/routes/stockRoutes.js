import express from 'express';
const router = express.Router();
import {
    readStocks, readStock, createStock, updateStock, deleteStock,
    readStockEvents, readStockEvent, createStockEvent, updateStockEvent, deleteStockEvent,
    readInventories, readInventory, createInventory, updateInventory, deleteInventory,
    readShelves, readShelf, createShelf, updateShelf, deleteShelf
} from '../modules/stock/stockController.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

// Shelf routes (must be before /:id to avoid 'shelf' matching as an id)

/**
 * @swagger
 * /stock/shelf:
 *   get:
 *     summary: Get all shelves
 *     description: Retrieve all shelves within the caller's tenant. Supports query parameter filtering.
 *     tags: [Shelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: stockId
 *         schema:
 *           type: string
 *         description: Filter by stock (warehouse) ID
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by shelf name
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Filter by shelf code
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Array of shelf objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shelf'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *   post:
 *     summary: Create a new shelf
 *     description: Create a new shelf within the caller's tenant.
 *     tags: [Shelves]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShelfCreate'
 *     responses:
 *       201:
 *         description: Shelf created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelf'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
router.get('/shelf', authorizationMiddleware('stock', 'readShelves'), readShelves);
router.post('/shelf', authorizationMiddleware('stock', 'createShelf'), createShelf);

/**
 * @swagger
 * /stock/shelf/{id}:
 *   get:
 *     summary: Get shelf by ID
 *     description: Retrieve a single shelf by its ID within the caller's tenant.
 *     tags: [Shelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shelf ID
 *     responses:
 *       200:
 *         description: Shelf object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelf'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *         description: Shelf not found
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
 *   put:
 *     summary: Update shelf
 *     description: Update an existing shelf by its ID within the caller's tenant.
 *     tags: [Shelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shelf ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShelfUpdate'
 *     responses:
 *       200:
 *         description: Updated shelf object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelf'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *         description: Shelf not found
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
 *   delete:
 *     summary: Delete shelf
 *     description: Delete a shelf by its ID within the caller's tenant.
 *     tags: [Shelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shelf ID
 *     responses:
 *       200:
 *         description: Shelf deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *         description: Shelf not found
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
router.get('/shelf/:id', authorizationMiddleware('stock', 'readShelf'), readShelf);
router.put('/shelf/:id', authorizationMiddleware('stock', 'updateShelf'), updateShelf);
router.delete('/shelf/:id', authorizationMiddleware('stock', 'deleteShelf'), deleteShelf);

// Stock event routes

/**
 * @swagger
 * /stock/event:
 *   get:
 *     summary: Get all stock events
 *     description: Retrieve all stock events within the caller's tenant. Supports query parameter filtering.
 *     tags: [Stock Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: eventType
 *         schema:
 *           type: string
 *           enum: [receipt, issue, transfer, adjustment, stocktake]
 *         description: Filter by event type
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter by product ID
 *       - in: query
 *         name: sourceStockId
 *         schema:
 *           type: string
 *         description: Filter by source stock ID
 *       - in: query
 *         name: destinationStockId
 *         schema:
 *           type: string
 *         description: Filter by destination stock ID
 *     responses:
 *       200:
 *         description: Array of stock event objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockEvent'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *   post:
 *     summary: Create a new stock event
 *     description: Create a new stock event within the caller's tenant.
 *     tags: [Stock Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockEventCreate'
 *     responses:
 *       201:
 *         description: Stock event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockEvent'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
router.get('/event', authorizationMiddleware('stock', 'readStockEvents'), readStockEvents);
router.post('/event', authorizationMiddleware('stock', 'createStockEvent'), createStockEvent);

/**
 * @swagger
 * /stock/event/{id}:
 *   get:
 *     summary: Get stock event by ID
 *     description: Retrieve a single stock event by its ID within the caller's tenant.
 *     tags: [Stock Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock event ID
 *     responses:
 *       200:
 *         description: Stock event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockEvent'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *         description: Stock event not found
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
 *   put:
 *     summary: Update stock event
 *     description: Update an existing stock event by its ID within the caller's tenant.
 *     tags: [Stock Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockEventUpdate'
 *     responses:
 *       200:
 *         description: Updated stock event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockEvent'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *         description: Stock event not found
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
 *   delete:
 *     summary: Delete stock event
 *     description: Delete a stock event by its ID within the caller's tenant.
 *     tags: [Stock Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock event ID
 *     responses:
 *       200:
 *         description: Stock event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *         description: Stock event not found
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
router.get('/event/:id', authorizationMiddleware('stock', 'readStockEvent'), readStockEvent);
router.put('/event/:id', authorizationMiddleware('stock', 'updateStockEvent'), updateStockEvent);
router.delete('/event/:id', authorizationMiddleware('stock', 'deleteStockEvent'), deleteStockEvent);

// Inventory routes

/**
 * @swagger
 * /stock/inventory:
 *   get:
 *     summary: Get all inventories
 *     description: Retrieve all inventory entries within the caller's tenant. Supports query parameter filtering.
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: stockId
 *         schema:
 *           type: string
 *         description: Filter by stock (warehouse) ID
 *       - in: query
 *         name: shelfId
 *         schema:
 *           type: string
 *         description: Filter by shelf ID
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter by product ID
 *     responses:
 *       200:
 *         description: Array of inventory objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventory'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *   post:
 *     summary: Create a new inventory entry
 *     description: Create a new inventory entry within the caller's tenant.
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryCreate'
 *     responses:
 *       201:
 *         description: Inventory entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
router.get('/inventory', authorizationMiddleware('stock', 'readInventories'), readInventories);
router.post('/inventory', authorizationMiddleware('stock', 'createInventory'), createInventory);

/**
 * @swagger
 * /stock/inventory/{id}:
 *   get:
 *     summary: Get inventory entry by ID
 *     description: Retrieve a single inventory entry by its ID within the caller's tenant.
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory ID
 *     responses:
 *       200:
 *         description: Inventory object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *         description: Inventory entry not found
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
 *   put:
 *     summary: Update inventory entry
 *     description: Update an existing inventory entry by its ID within the caller's tenant.
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryUpdate'
 *     responses:
 *       200:
 *         description: Updated inventory object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *         description: Inventory entry not found
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
 *   delete:
 *     summary: Delete inventory entry
 *     description: Delete an inventory entry by its ID within the caller's tenant.
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory ID
 *     responses:
 *       200:
 *         description: Inventory entry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *         description: Inventory entry not found
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
router.get('/inventory/:id', authorizationMiddleware('stock', 'readInventory'), readInventory);
router.put('/inventory/:id', authorizationMiddleware('stock', 'updateInventory'), updateInventory);
router.delete('/inventory/:id', authorizationMiddleware('stock', 'deleteInventory'), deleteInventory);

// Stock (warehouse) routes

/**
 * @swagger
 * /stock:
 *   get:
 *     summary: Get all stocks
 *     description: Retrieve all stocks (warehouses) within the caller's tenant. Supports query parameter filtering.
 *     tags: [Stocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by stock name
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: manager
 *         schema:
 *           type: string
 *         description: Filter by manager
 *     responses:
 *       200:
 *         description: Array of stock objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stock'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *   post:
 *     summary: Create a new stock
 *     description: Create a new stock (warehouse) within the caller's tenant.
 *     tags: [Stocks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockCreate'
 *     responses:
 *       201:
 *         description: Stock created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
router.get('/', authorizationMiddleware('stock', 'readStocks'), readStocks);
router.post('/', authorizationMiddleware('stock', 'createStock'), createStock);

/**
 * @swagger
 * /stock/{id}:
 *   get:
 *     summary: Get stock by ID
 *     description: Retrieve a single stock (warehouse) by its ID within the caller's tenant.
 *     tags: [Stocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock ID
 *     responses:
 *       200:
 *         description: Stock object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *         description: Stock not found
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
 *   put:
 *     summary: Update stock
 *     description: Update an existing stock (warehouse) by its ID within the caller's tenant.
 *     tags: [Stocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockUpdate'
 *     responses:
 *       200:
 *         description: Updated stock object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stock'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *         description: Stock not found
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
 *   delete:
 *     summary: Delete stock
 *     description: Delete a stock (warehouse) by its ID within the caller's tenant.
 *     tags: [Stocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock ID
 *     responses:
 *       200:
 *         description: Stock deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *         description: Stock not found
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
router.get('/:id', authorizationMiddleware('stock', 'readStock'), readStock);
router.put('/:id', authorizationMiddleware('stock', 'updateStock'), updateStock);
router.delete('/:id', authorizationMiddleware('stock', 'deleteStock'), deleteStock);

export default router;