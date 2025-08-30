import {sanitizeValue, sanitizeNestedJson}  from "./../utils/sanitization.js";

/* 
* Middleware to sanitize incoming requests
* @param {Object} req - The Express request object.
* @param {Object} res - The Express response object.    
* @param {Function} next - The next middleware function.
*/
const sanitizeRequest = (req, res, next) => {
    // Method and body check
    if (req.method != "GET" && req.method != "DELETE") {
        if (!req.body) return res.status(400).json({ error: `Missing ${req.method} request body.` });
    }

    // Body sanitation
    req.body = sanitizeNestedJson(req.body);

    // Authorization header sanitation.
    if (req.headers && req.headers['authorization']) req.headers.authorization = sanitizeValue(req.headers['authorization']);

    // Http query sanitation
    if (req.query) {
        for (const key in req.query) {
           if (typeof req.query[key] === 'string') req.query[key] = sanitizeValue(req.query[key]);
        }
    }
    
    // Http params sanitation
    if (req.params) {
        for (const key in req.params) {
            if (typeof req.params[key] === 'string') req.params[key] = sanitizeValue(req.params[key]);
        }
    }
    next();
}

export default sanitizeRequest;

