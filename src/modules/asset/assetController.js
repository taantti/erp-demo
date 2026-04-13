import { roles } from '../../models/roleModel.js';
import { ProductUnits } from '../../models/productModel.js';
import { log } from '../../utils/logger.js';
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
    log("INFO", `${relativePath}: readRoles(): `, true, req);
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
    log("INFO", `${relativePath}: readProductUnits(): `, true, req);
    try {
        res.status(200).json(Object.values(ProductUnits));
    } catch (error) {
        return next(error);
    }
};