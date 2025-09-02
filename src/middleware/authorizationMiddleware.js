import jwt from 'jsonwebtoken';
import config from '../config.js';
import { Role } from '../models/index.js';
import { log } from '../utils/logger.js';

/*
* Authorization middleware for checking user permissions.
* @param {String} module - The module to check (e.g., 'user', 'tenant', 'role').
* @param {String} feature - The feature to check (e.g., 'read', 'create', 'update', 'delete').
* @returns {Function} - Returns authorizationMiddleware function.
*/
const authorize = (module, feature) => {
    return async (req, res, next) => {

        log("INFO", "authorizationMiddleware.js: module = " + module, true, req);
        log("INFO", "authorizationMiddleware.js: feature = " + feature, true, req);
        log("INFO", "authorizationMiddleware.js: req.user.userId = " + req.user.userId, true, req);
        log("INFO", "authorizationMiddleware.js: req.user.role = " + req.user.role, true, req);
        log("INFO", "authorizationMiddleware.js: req.user.tenantId = " + req.user.tenantId, true, req);

        if (!module) {
            log("ERROR", `authorizationMiddleware.js: Missing module.`, true, req);
            return res.status(500).json({ error:  `Internal Server Error` });
        }

        if (!feature) {
            log("ERROR", `authorizationMiddleware.js: Missing feature.`, true,  req);
            return res.status(500).json({ error:  `Internal Server Error` });
        }


        if (!req.user.userId) {
            log("ERROR", `authorizationMiddleware.js: Missing userId.`, true, req);
            return res.status(500).json({ error:  `Internal Server Error` });
        }

        if (!req.user.role) {
            log("ERROR", `authorizationMiddleware.js: Missing role.`, true, req);
            return res.status(500).json({ error:  `Internal Server Error` });
        }

        try {
            const role = await Role.findOne({ role: req.user.role }).lean(); // lean() returns a plain JavaScript object instead of a Mongoose document
            if (!role) {
                log("ERROR", `authorizationMiddleware.js: No role: ${req.user.role } found.`, true, req);
                return res.status(403).json({ error: 'Access denied.'});
            }

            const modulePermissions = role.rolePermission?.[module];
            if (!modulePermissions) {
                log("ERROR", `authorizationMiddleware.js: Module ${module} not found in rolePermission.`, true, req);
                return res.status(403).json({ error: 'Access denied.'});
            }

            const featurePermissions = modulePermissions?.[feature];
            if (!featurePermissions) {
                log("ERROR", `authorizationMiddleware.js: Feature '${feature}' not found in module ${module}.`, true, req);
                return res.status(403).json({ error: 'Access denied.'});
            }

            if (!featurePermissions.access) {
                log("ERROR", `authorizationMiddleware.js: Access false. Module: ${module} Feature: ${feature}.`, true, req);
                return res.status(403).json({ error: 'Access denied.' });
            }

            log("INFO", "authorizationMiddleware.js: Access true.", true, req);
            return next();
        } catch (err) {
            log("ERROR", "authorizationMiddleware.js: error = " + err.message, true, req);
            return res.status(500).json({ error:  `Internal Server Error` });
        }
    };
};

export default authorize;


