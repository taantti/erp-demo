import { roles } from '../../models/roleModel.js';
import { ProductUnits } from '../../models/productModel.js';
import { StockEventTypes } from '../../models/stockEventModel.js';
import { CustomerAddressType } from '../../models/customerModel.js';
import { getRelativePath } from '../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

/**
 * Returns available roles based on the requesting user's role.
 * @param {string} userRole - The role of the requesting user.
 * @returns {string[]} An array of roles that the user can assign to other users.
 */
const getAvailableRoles = (userRole) => {
    const roleHierarchy = roles;
    const userLevel = roleHierarchy.indexOf(userRole);
    return roleHierarchy.slice(0, userLevel + 1); // Include roles up to and including the user's role
};

/**
 * Returns available roles based on the requesting user's role.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const readRoles = async (req, res, next) => {
    try {
        res.status(200).json(getAvailableRoles(req.user.role));
    } catch (error) {
        return next(error);
    }
};

/**
 * Returns available product units.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<Object>} - The available product units.
 */
export const readProductUnits = async (req, res, next) => {
    try {
        res.status(200).json(Object.values(ProductUnits));
    } catch (error) {
        return next(error);
    }
};

/**
 * Returns available stock event types.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<Object>} - The available stock event types.
 */
export const readStockEventTypes = async (req, res, next) => {
    try {
        res.status(200).json(Object.values(StockEventTypes));
    } catch (error) {
        return next(error);
    }
};

/**
 * Returns available customer address types.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<Object>} - The available customer address types.
 */
export const readCustomerAddressTypes = async (req, res, next) => {
    try {
        res.status(200).json(Object.values(CustomerAddressType));
    } catch (error) {
        return next(error);
    }
};