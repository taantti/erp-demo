import sanitizeHtml from "sanitize-html";
import aux from "./../utils/auxiliary.js";

/*
* Sanitize an array of values
* @param {Array} arr - The array to sanitize.
* @returns {Array} - The sanitized array.
*/
const sanitizeArray = (arr) => {
    return arr.map(item => sanitizeValue(item));
}

/*
* Sanitize an object with key-value pairs
* @param {Object} obj - The object to sanitize.
* @returns {Object} - The sanitized object.
*/
const sanitizeObject = (obj) => {
    const sanitizedObj = {};
    for (const key in obj) {
        //let value = obj[key];
        let value = sanitizeNestedJson(obj[key]);
        value = sanitizeValue(value);
        sanitizedObj[key] = value;
    }
    return sanitizedObj;
}

/* 
* Sanitize a single value
* @param {String} value - The value to sanitize.
* @returns {String} - The sanitized value.
*/
const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        value = sanitizeHtml(value, { // Sanitize HTML
            allowedTags: [], // No HTML tags allowed
            allowedAttributes: {} // No attributes allowed
        }).trim(); // Remove leading/trailing whitespaces
    }
    return value;
}

/*
* Recursively sanitize nested JSON structures (objects and arrays)
* @param {Object|Array} data - The JSON data to sanitize.
* @returns {Object|Array} - The sanitized JSON data.
*/
const sanitizeNestedJson = (data) => {
    if (!data) return data;
    if (Array.isArray(data)) return sanitizeArray(data);
    if (typeof data === 'object') return sanitizeObject(data);
    return data;
}

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

    // Authorization headeri sanitation.   
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

