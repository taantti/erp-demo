import jwt from 'jsonwebtoken';
import config from '../config.js';
import { User, Tenant } from '../models/index.js';
import { log } from '../utils/logger.js';
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

/**
 * Authentication middleware for verifying JWT tokens.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const auth = async (req, res, next) => {
    log("INFO", `${relativePath}:`, true, req);
    const authHeader = req.headers['authorization'];

    log("INFO", `${relativePath}: authHeader: ${authHeader}`, true, req);


    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(Object.assign(new Error('Missing or malformed Authorization header.'), { statusCode: 401 }));
    }
    const token = authHeader.split(' ')[1];
    if (!token) return next(Object.assign(new Error('Missing token.'), { statusCode: 401 }));

    try {
        const decodedToken = jwt.verify(token, config.JWT_SECRET_KEY);
        const user = await User.findById(decodedToken.user_id);
        if (!user || !user.active) return next(Object.assign(new Error('No active user found.'), { statusCode: 403 }));
        if (!user.role) return next(Object.assign(new Error('User has no role.'), { statusCode: 403 }));
        const tenant = await Tenant.findById(user.tenant);
        if (!tenant || !tenant.active) return next(Object.assign(new Error('No active tenant found.'), { statusCode: 403 }));

        req.user = {
            userId: user._id,
            username: user.username,
            role: user.role,
            tenant: {
                id: tenant._id,
                name: tenant.name,
                admin: tenant.admin
            }
        }

        return next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return next(Object.assign(new Error('Invalid or malformed token.'), { statusCode: 401 }));
        }
        return next(err);
    }
}

export default auth;