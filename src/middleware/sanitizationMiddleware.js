import sanitizeHtml from "sanitize-html";
import aux from "./../utils/auxiliary.js";
import {sanitizeNestedJson}  from "./../utils/sanitization.js";

/* 
* Middleware to sanitize incoming requests
* @param {Object} req - The Express request object.
* @param {Object} res - The Express response object.    
* @param {Function} next - The next middleware function.
*/
const sanitizeRequest = (req, res, next) => {

    aux.cLog("sanitizeRequest: PRE SANITATION: req.body = " + JSON.stringify(req.body, null, 2));

    if (req.method != "GET" && req.method != "DELETE") {
        aux.cLog("sanitizeRequest: req.method = " + req.method);
        if (!req.body) return res.status(400).json({ error: 'Missing request body' });
    }

    // Body sanitation
    req.body = sanitizeNestedJson(req.body);
    aux.cLog("POST SANITATION: req.body = " + JSON.stringify(req.body, null, 2));

    // Authorization header sanitation.
    if (req.headers && req.headers['authorization']) {
        req.headers.authorization = sanitizeHtml(req.headers['authorization'], { // Sanitize HTML
            allowedTags: [], // No HTML tags allowed
            allowedAttributes: {} // No attributes allowed
        }).trim(); // Remove leading/trailing whitespaces
    }
    
    // Http query sanitation
    if (req.query) {
        for (const key in req.query) {
            let value = req.query[key];
            if (typeof value === 'string') {
                value = value.trim();
                value = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                req.query[key] = value;
            }
        }
    }

    next();
}

export default sanitizeRequest;

