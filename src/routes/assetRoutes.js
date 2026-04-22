import express from 'express';
import { readRoles, readProductUnits, readStockEventTypes } from '../modules/asset/assetController.js';

const router = express.Router();

/**
 * @swagger
 * /asset/user/roles:
 *   get:
 *     summary: Get available user roles
 *     description: Returns a list of user roles that the authenticated user can assign. Higher roles see more options based on role hierarchy.
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of role strings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [READER, WRITER, ADMIN, OVERSEER]
 *             example: ["READER", "WRITER", "ADMIN"]
 *       401:
 *         description: Unauthorized
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
router.get('/user/roles', readRoles);

/**
 * @swagger
 * /asset/product/units:
 *   get:
 *     summary: Get available product units
 *     description: Returns a list of all available product measurement units.
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of unit strings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             example: ["piece", "kilogram", "gram", "liter", "meter", "centimeter", "millimeter", "box", "no_unit"]
 *       401:
 *         description: Unauthorized
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
router.get('/product/units', readProductUnits);

/**
 * @swagger
 * /asset/stock/event-types:
 *   get:
 *     summary: Get available stock event types
 *     description: Returns a list of all available stock event types.
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of event type strings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             example: ["receipt", "issue", "transfer", "adjustment", "stocktake"]
 *       401:
 *         description: Unauthorized
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
router.get('/stock/event-types', readStockEventTypes);

export default router;