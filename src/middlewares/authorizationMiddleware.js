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
            log("ERROR", `${relativePath}: Missing module.`, true, req);
            return next(Object.assign(new Error('Internal Server Error'), { statusCode: 500 }));
        }

        if (!feature) {
            log("ERROR", `${relativePath}: Missing feature.`, true, req);
            return next(Object.assign(new Error('Internal Server Error'), { statusCode: 500 }));
        }


        if (!req.user.userId) {
            log("ERROR", `${relativePath}: Missing userId.`, true, req);
            return next(Object.assign(new Error('Internal Server Error'), { statusCode: 500 }));
        }

        if (!req.user.role) {
            log("ERROR", `${relativePath}: Missing role.`, true, req);
            return next(Object.assign(new Error('Internal Server Error'), { statusCode: 500 }));
        }

        try {
            const role = await Role.findOne({ role: req.user.role }).lean(); // lean() returns a plain JavaScript object instead of a Mongoose document
            if (!role) {
                log("ERROR", `${relativePath}: No role: ${req.user.role } found.`, true, req);
                return next(Object.assign(new Error('Access denied.'), { statusCode: 403 }));
            }

            const modulePermissions = role.rolePermission?.[module];
            if (!modulePermissions) {
                log("ERROR", `${relativePath}: Module ${module} not found in rolePermission.`, true, req);
                return next(Object.assign(new Error('Access denied.'), { statusCode: 403 }));
            }

            const featurePermissions = modulePermissions?.[feature];
            if (!featurePermissions) {
                log("ERROR", `${relativePath}: Feature '${feature}' not found in module ${module}.`, true, req);
                return next(Object.assign(new Error('Access denied.'), { statusCode: 403 }));
            }

            if (!featurePermissions.access) {
                log("ERROR", `${relativePath}: Access false. Module: ${module} Feature: ${feature}.`, true, req);
                return next(Object.assign(new Error('Access denied.'), { statusCode: 403 }));
            }

            log("INFO", `${relativePath}: Access true.`, true, req);
            return next();
        } catch (err) {
            return next(err);
        }
    };
};

export default authorize;


