import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import config from './../../../config.js';
import { User } from '../../../models/index.js';
import { Role } from '../../../models/index.js';

/**
 * Login service. Validates user credentials and generates JWT token
 * @param {Object} req - Express request object
 * @returns {string} - JWT token
 * @throws {Error} 401 on invalid credentials, 403 if the user is inactive or has no valid role
 */
export const login = async (req) => {
    const { username, password } = req.body;

    if (!username || !password) throw Object.assign(new Error(`Invalid credentials`), { statusCode: 401 });
    const user = await User.findOne({ username: username });
    if (!user) throw Object.assign(new Error(`Invalid credentials`), { statusCode: 401 });

    if (!await bcrypt.compare(password, user.password)) {
        throw Object.assign(new Error(`Invalid credentials`), { statusCode: 401 });
    }

    if (!user.active) throw Object.assign(new Error('User is not active.'), { statusCode: 403 });
    if (!user.role) throw Object.assign(new Error('User has no role.'), { statusCode: 403 });

    const role = await Role.findOne({ role: user.role });
    if (!role) throw Object.assign(new Error('User role not found.'), { statusCode: 403 });

    const payload = {
        user_id: user._id,
        username: user.username,
        user_first_name: user.first_name,
        user_last_name: user.last_name,
        role: role.name,
        rolePermission: role.rolePermission
    }

    return jwt.sign(payload, config.JWT_SECRET_KEY, { expiresIn: config.JWT_TOKEN_EXPIRATION });
};
