import config from './../../../config.js';
import bcrypt from "bcrypt";
import { findUsers, findUserById, newUser, findOneUserAndUpdate, deleteUserById } from '../../../models/index.js';
import { log } from '../../../utils/logger.js';
import { getRelativePath } from '../../../utils/auxiliary.js';
import { sanitizeObjectFields } from '../../../utils/sanitization.js';

const relativePath = getRelativePath(import.meta.url);

/**
 * Creates a new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} The created user
 */
export const createUser = async (req, res, next) => {
    try {
        const user = await newUser(req, req.body, false, true, true);
        return user;
    } catch (error) {
        return next(error);
    }
};

/**
 * Reads a user by ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} The user
 */
export const readUser = async (req, res, next) => {
    try {
        const user = await findUserById(req, req.params.id, false, true, true);
        return user;
    } catch (error) {
        return next(error);
    }
};

/**
 * Reads all users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Array} The users
 */
export const readUsers = async (req, res, next) => {
    try {
        const users = await findUsers(req, req.query, false, true, true);
        return users;
    } catch (error) {
        return next(error);
    }
};

/**
 * Updates a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} The updated user
 */
export const updateUser = async (req, res, next) => {
    try {
        req.body = sanitizeObjectFields(req.body, ['username', 'password', 'tenant']); // These fields cannot be updated here.
        const user = await findOneUserAndUpdate(req, req.params.id, req.body, false, true, true);
        return user;
    } catch (error) {
        return next(error);
    }
};


/**
 * Updates a user's password
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Boolean} True if the password was updated successfully
 */
export const updateUserPassword = async (req, res, next) => {
    try {
        if (req.user.username !== req.body.username) {
            log("CRITICAL", `${relativePath}: ${req.user.username} is not allowed to change password for ${req.body.username}`, true, req);
            return next(Object.assign(new Error("Unauthorized"), { statusCode: 401 }));
        }
        if (!req.body.password || !req.body.new_password) {
            return next(Object.assign(new Error("Bad Request. Current and new passwords are required."), { statusCode: 400 }));
        }

        const user = await findUserById(req, req.params.id, false, false, false);
        if (!user) return false;

        if (!await bcrypt.compare(req.body.password, user.password)) {
            return next(Object.assign(new Error("Unauthorized"), { statusCode: 401 }));
        }

        const saltRounds = Number(config.BCRYPT_SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(req.body.new_password, saltRounds);
        user.password = hashedPassword;
        await user.save();

        return true;

    } catch (error) {
        return next(error);
    }
}

/**
 * Deletes a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} The deleted user
 */
export const deleteUser = async (req, res, next) => {
    try {
        const user = await deleteUserById(req, req.params.id, false);
        return user;
    } catch (error) {
        return next(error);
    }
};
