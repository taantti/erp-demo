import config from './../config.js';
import { sanitizeValue, sanitizeNestedJson } from "./../utils/sanitization.js";

/**
 * Middleware to sanitize incoming requests
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
const sanitizeRequest = (req, res, next) => {
    try {
        if (isBodyRequired(req) && !req.body) {
            return next(Object.assign(new Error(`Missing ${req.method} request body.`), { statusCode: 400 }));
        }

        if (!isCheckRequestBodySizeValid(req)) {
            return next(Object.assign(new Error(`Request body is too large.`), { statusCode: 413 }));
        }

        if (!isTotalQueryStringLengthValid(req)) {
            return next(Object.assign(new Error(`Query string is too large.`), { statusCode: 413 }));
        }

        if (!isIndividualQueryParamLengthValid(req)) {
            return next(Object.assign(new Error(`One or more query parameters are too large.`), { statusCode: 413 }));
        }

        if (!isIndividualPathParamLengthValid(req)) {
            return next(Object.assign(new Error(`One or more path parameters are too large.`), { statusCode: 413 }));
        }

        // Body sanitation. Example: { "name": "John", "age": 30, "address": { "city": "New York" } }
        req.body = sanitizeNestedJson(req.body);

        // Http query sanitation. Example: ?name=John&age=30
        req.query = sanitizeQueryParams(req);

        // Path parameters sanitation. Example: /api/user/:id
        req.params = sanitizePathParams(req);

        // Header sanitation. Example: Authorization: bearer token_string
        req.headers = sanitizeHeaders(req);

        return next();
    } catch (err) {
        return next(err);
    }
}

/**
 * Check if the request body is required based on the HTTP method.
 * @param {Object} req - The Express request object.
 * @returns {boolean} - True if the body is required, false otherwise.
 */
const isBodyRequired = (req) => {
    return (req.method === "POST" || req.method === "PUT" || req.method === "PATCH");
}

/**
 * Check if the request body size is valid.
 * @param {Object} req - The Express request object.
 * @returns {boolean} - True if the body size is valid, false otherwise.
 */
const isCheckRequestBodySizeValid = (req) => {
    if (!req.body) return true;
    return JSON.stringify(req.body).length <= config.MAX_REQUEST_BODY_SIZE;
}

/** 
 * Check if the total query string length is valid.
 * @param {Object} req - The Express request object.
 * @returns {boolean} - True if the total query string length is valid, false otherwise.
 */
const isTotalQueryStringLengthValid = (req) => {
    if (!req.originalUrl) return true;
    return req.originalUrl.length <= config.MAX_QUERY_STRING_LENGTH;
}

/** 
 * Check if individual query parameters are within the allowed length.
 * @param {Object} req - The Express request object.
 * @returns {boolean} - True if all individual query parameters are valid, false otherwise.
 */
const isIndividualQueryParamLengthValid = (req) => {
    if (!req.query) return true;
    for (const key in req.query) {
        if (req.query[key].length > config.MAX_QUERY_PARAM_LENGTH) {
            return false;
        }
    }
    return true;
}

/** 
 * Check if individual path parameters are within the allowed length.
 * @param {Object} req - The Express request object.
 * @returns {boolean} - True if all individual path parameters are valid, false otherwise.
 */
const isIndividualPathParamLengthValid = (req) => {
    if (!req.params) return true;
    for (const key in req.params) {
        if (req.params[key].length > config.MAX_PATH_PARAM_LENGTH) {
            return false;
        }
    }
    return true;
}

/**
 * Sanitize query parameters in the request.
 * @param {Object} req - The Express request object.
 * @returns {Object} - The sanitized query parameters.
 */
const sanitizeQueryParams = (req) => {
    if (!req.query) return req.query;
    for (const key in req.query) {
        req.query[key] = sanitizeQueryParam(req.query[key]);
    }
    return req.query;
}

/**
 * Sanitize path parameters in the request.
 * @param {Object} req - The Express request object.
 * @returns {Object} - The sanitized path parameters.
 */
const sanitizePathParams = (req) => {
    if (!req.params) return req.params;
    for (const key in req.params) {
        req.params[key] = sanitizePathParam(req.params[key]);
    }
    return req.params;
}

/**
 * Sanitize a single path parameter.
 * @param {*} value - The path parameter value to sanitize.
 * @returns {*} - The sanitized path parameter value.
 */
const sanitizePathParam = (value) => {
    if (typeof value === 'string') return sanitizeValue(value);
    return value;
}

/**
 * Sanitize headers in the request.
 * @param {Object} req - The Express request object.
 * @returns {Object} - The sanitized headers.
 */
const sanitizeHeaders = (req) => {
    if (!req.headers) return req.headers;
    for (const key in req.headers) {
        req.headers[key] = sanitizeHeader(req.headers[key]);
    }
    return req.headers;
}

/**
 * Sanitize a single header.
 * @param {*} value - The header value to sanitize.
 * @returns {*} - The sanitized header value.
 */
const sanitizeHeader = (value) => {
    if (typeof value === 'string') return sanitizeValue(value);
    return value;
}

/**
 * Sanitize a single query parameter.
 * @param {*} value - The query parameter value to sanitize.
 * @returns {*} - The sanitized query parameter value.
 */
const sanitizeQueryParam = (value) => {
    if (typeof value === 'string') return sanitizeValue(value);
    return value;
}

export default sanitizeRequest;

