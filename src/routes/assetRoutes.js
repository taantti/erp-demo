import express from 'express';
import { readRoles, readProductUnits } from '../modules/asset/assetController.js';

const router = express.Router();

/**
 * @swagger
 * /asset/roles:
 *   get:
 *     summary: Get available roles
 *     description: Returns a list of roles that the authenticated user can assign. Higher roles see more options based on role hierarchy.
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
router.get('/roles', readRoles);

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

export default router;