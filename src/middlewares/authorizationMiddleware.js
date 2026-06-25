import jwt from 'jsonwebtoken';
import config from '../config.js';
import { Role } from '../models/index.js';
import { log } from '../utils/logger.js';
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

/**
* Authorization middleware for checking user permissions.
* @param {String} module - The module to check (e.g., 'user', 'tenant', 'role').
* @param {String} feature - The feature to check (e.g., 'read', 'create', 'update', 'delete').
* @returns {Function} - Returns authorizationMiddleware function.
*/
const authorize = (module, feature) => {
    return async (req, res, next) => {
        if (!module) {
            return next(Object.assign(new Error('Internal Server Error'), { statusCode: 500 }));
        }

        if (!feature) {
            return next(Object.assign(new Error('Internal Server Error'), { statusCode: 500 }));
        }

        if (!req.user.userId) {
            return next(Object.assign(new Error('Internal Server Error'), { statusCode: 500 }));
        }

        if (!req.user.role) {
            return next(Object.assign(new Error('Internal Server Error'), { statusCode: 500 }));
        }

        try {
            const role = await Role.findOne({ role: req.user.role }).lean(); // lean() returns a plain JavaScript object instead of a Mongoose document
            if (!role) {
                return next(Object.assign(new Error('Access denied.'), { statusCode: 403 }));
            }

            const modulePermissions = role.rolePermission?.[module];
            if (!modulePermissions) {
                return next(Object.assign(new Error('Access denied.'), { statusCode: 403 }));
            }

            const featurePermissions = modulePermissions?.[feature];
            if (!featurePermissions) {
                return next(Object.assign(new Error('Access denied.'), { statusCode: 403 }));
            }

            if (!featurePermissions.access) {
                return next(Object.assign(new Error('Access denied.'), { statusCode: 403 }));
            }

            return next();
        } catch (err) {
            return next(err);
        }
    };
};

export default authorize;


