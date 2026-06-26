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
 * @returns {Object} The created user
 */
export const createUser = async (req) => {
    return await newUser(req, req.body, false, true, true);
};

/**
 * Reads a user by ID
 * @param {Object} req - The request object
 * @returns {Object|null} The user, or null if not found
 */
export const readUser = async (req) => {
    return await findUserById(req, req.params.id, false, true, true);
};

/**
 * Reads all users
 * @param {Object} req - The request object
 * @returns {Array} The users
 */
export const readUsers = async (req) => {
    return await findUsers(req, req.query, false, true, true);
};

/**
 * Updates a user
 * @param {Object} req - The request object
 * @returns {Object|null} The updated user, or null if not found
 */
export const updateUser = async (req) => {
    req.body = sanitizeObjectFields(req.body, ['username', 'password', 'tenant']); // These fields cannot be updated here.
    return await findOneUserAndUpdate(req, req.params.id, req.body, false, true, true);
};


/**
 * Updates a user's password
 * @param {Object} req - The request object
 * @returns {Boolean} True if the password was updated, false if the user was not found
 * @throws {Error} 401 if the caller may not change this user's password, 400 if required fields are missing
 */
export const updateUserPassword = async (req) => {
    if (req.user.username !== req.body.username) {
        log("CRITICAL", `${relativePath}: ${req.user.username} is not allowed to change password for ${req.body.username}`, true, req);
        throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
    }
    if (!req.body.password || !req.body.new_password) {
        throw Object.assign(new Error("Bad Request. Current and new passwords are required."), { statusCode: 400 });
    }

    const user = await findUserById(req, req.params.id, false, false, false);
    if (!user) return false;

    if (!await bcrypt.compare(req.body.password, user.password)) {
        throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
    }

    const saltRounds = Number(config.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(req.body.new_password, saltRounds);
    user.password = hashedPassword;
    await user.save();

    return true;
}

/**
 * Deletes a user
 * @param {Object} req - The request object
 * @returns {Object|null} The deleted user, or null if not found
 */
export const deleteUser = async (req) => {
    return await deleteUserById(req, req.params.id, false);
};
