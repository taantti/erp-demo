import userService from './services/index.js';

/**
 * Reads all users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Array} The users
 */
export const readUsers = async (req, res, next) => {
    try {
        const users = await userService.readUsers(req, res, next);
        res.status(200).json(users);
    } catch (error) {
        return next(error);
    }
};

/**
 * Reads a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} The user
 */
export const readUser = async (req, res, next) => {
    try {
        const user = await userService.readUser(req, res, next);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
};

/**
 * Creates a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} The created user
 */
export const createUser = async (req, res, next) => {
    try {
        const newUser = await userService.createUser(req, res, next);
        if (!newUser) return res.status(400).json({ error: 'User not created' });
        res.status(201).json(newUser);
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
        const updatedUser = await userService.updateUser(req, res, next);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        return next(error);
    }
};

/**
 * Updates a user's password
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} The updated user
 */
export const updateUserPassword = async (req, res, next) => {
    try {
        const result = await userService.updateUserPassword(req, res, next);
        if (!result) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ msg: 'Password updated' });
    } catch (error) {
        return next(error);
    }
};

/**
 * Deletes a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} The deleted user
 */
export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await userService.deleteUser(req, res, next);
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ msg: 'User deleted' });
    } catch (error) {
        return next(error);
    }
};
