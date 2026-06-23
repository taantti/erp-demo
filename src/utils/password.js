import bcrypt from "bcrypt";
import config from './../../src/config.js';

/**
 * Hash a password using bcrypt
 * @param {string} password - The password to hash
 * @returns {Promise<string>} - The hashed password
 */
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(Number(config.BCRYPT_SALT_ROUNDS));
    return await bcrypt.hash(password, salt);
}
