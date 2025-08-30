import jwt from 'jsonwebtoken';
import config from '../config.js';
import { Role } from '../models/index.js';
import aux from "../utils/auxiliary.js";

/*
* Authorization middleware for checking user permissions.
* @param {String} module - The module to check (e.g., 'user', 'tenant', 'role').
* @param {String} feature - The feature to check (e.g., 'read', 'create', 'update', 'delete').
* @returns {Function} - Returns authorizationMiddleware function.
*/
const authorize = (module, feature) => {
    return async (req, res, next) => {

        aux.cLog("authorizationMiddleware.js: module = " + module);
        aux.cLog("authorizationMiddleware.js: feature = " + feature);
        aux.cLog("authorizationMiddleware.js: req.user.userId = " + req.user.userId);
        aux.cLog("authorizationMiddleware.js: req.user.role = " + req.user.role);
        aux.cLog("authorizationMiddleware.js: req.user.tenantId = " + req.user.tenantId);

        if (!module) {
            aux.cLog(`authorizationMiddleware.js: Missing module.`);
            return res.status(500).json({ error:  `Internal Server Error` });
        }

        if (!feature) {
            aux.cLog(`authorizationMiddleware.js: Missing feature.`);
            return res.status(500).json({ error:  `Internal Server Error` });
        }


        if (!req.user.userId) {
            aux.cLog(`authorizationMiddleware.js: Missing userId.`);
            return res.status(500).json({ error:  `Internal Server Error` });
        }

        if (!req.user.role) {
            aux.cLog(`authorizationMiddleware.js: Missing role.`);
            return res.status(500).json({ error:  `Internal Server Error` });
        }

        try {
            const role = await Role.findOne({ role: req.user.role }).lean();
            if (!role) {
                aux.cLog(`authorizationMiddleware.js: No role: ${req.user.role } found.`);
                return res.status(403).json({ error: 'Access denied.'});
            }

            const modulePermissions = role.rolePermission?.[module];
            if (!modulePermissions) {
                aux.cLog(`authorizationMiddleware.js: Module ${module} not found in rolePermission.`);
                return res.status(403).json({ error: 'Access denied.'});
            }

            const featurePermissions = modulePermissions?.[feature];
            if (!featurePermissions) {
                aux.cLog(`authorizationMiddleware.js: Feature '${feature}' not found in module ${module}.`);
                return res.status(403).json({ error: 'Access denied.'});
            }

            if (!featurePermissions.access) {
                aux.cLog(`authorizationMiddleware.js: Access false. Module: ${module} Feature: ${feature}.`);
                return res.status(403).json({ error: 'Access denied.' });
            }

            aux.cLog("authorizationMiddleware.js: Access true.");
            return next();
        } catch (err) {
            aux.cLog("authorizationMiddleware.js: error = " + err.message);
            return res.status(500).json({ error:  `Internal Server Error` });
        }
    };
};

export default authorize;


