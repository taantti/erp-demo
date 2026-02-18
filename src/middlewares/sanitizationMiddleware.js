import config from '../config.js';
import { sanitizeValue, isValidMaxValue, isValidMaxLength } from "../utils/sanitization.js";
import { log } from "../utils/logger.js";
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

/**
 * Middleware to sanitize and validate incoming requests
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
export const sanitizeAndValidateRequest = (req, res, next) => {
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

        // Http query sanitation. Example: ?name=John&age=30
        sanitizeQueryParams(req);

        // Path parameters sanitation. Example: /api/user/:id
        req.params = sanitizePathParams(req);

        // Header sanitation. Example: Authorization: bearer token_string
        req.headers = sanitizeHeaders(req);

        // Body sanitation. Example: { "name": "John", "age": 30, "address": { "city": "New York" } }
        if (isBodyRequired(req) && req.body) {
            const { errorMsgs } = validateAndSanitizeObject(req.body);
            if (errorMsgs && errorMsgs.length > 0) {
                const err = new Error('Validation failed');
                err.statusCode = 400;
                err.validationErrors = errorMsgs;
                return next(err);
            }
        }

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
        if (key.toLowerCase() === 'authorization') continue; // Do not sanitize Authorization header
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

/**
 * Traverses and validates (and sanitizes) a nested object using a stack.
 * Modifies the originalObject in-place so that all string values are trimmed.
 * Returns { result, errorMsgs }
 *
 * @param {Object} originalObject - The object to traverse, validate, and sanitize.
 * @returns {Object} - { result: [...], errorMsgs: [...] }
 */
const validateAndSanitizeObject = (originalObject) => {
    log("INFO", `${relativePath}: validateAndSanitizeObject()`, true);
    let stack = [];
    let result = [];
    let errorMsgs = [];

    /**
     * Validates and sanitizes a stack item.
     * @param {*} stackItem - The stack item to validate and sanitize.
     * @returns {boolean} - True if the stack item is valid, false otherwise.
     */
    const validateAndSanitize = (stackItem) => {
        if (typeof stackItem.data === "string") {
            // Sanitize in-place
            const trimmed = stackItem.data.trim();
            // Set the sanitized value in the original object
            setValueAtPath(originalObject, stackItem.path, trimmed);
            if (trimmed.length > config.MAX_VALUE_LENGTH) return false;
            return true;
        } else if (typeof stackItem.data === "number" || typeof stackItem.data === "boolean") {
            return true;
        }
        return false;
    };

    /** Helper to set value at a dot-separated path in an object
     * @param {Object} obj - The object to set the value in.
     * @param {String} path - The dot-separated path to set the value at.
     * @param {*} value - The value to set.
     */
    const setValueAtPath = (obj, path, value) => {
        if (!path) return;
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current)) return;
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    };

    /**
     * Creates an error message for a validation error.
     * @param {string} type - The type of validation error.
     * @param {string} path - The path to the invalid value.
     * @param {number} currentLength - The current length of the value.
     * @param {number} maxLength - The maximum allowed length.
     * @returns {Object} - The error message.
     */
    const createErrorMsg = (type, path, currentLength, maxLength) => {
        let message;
        switch (type) {
            case 'depth':
                message = `Exceeded maximum depth: The depth at path ${path} is ${currentLength}, which exceeds the maximum allowed depth of ${maxLength}.`;
                break;
            case 'array':
                message = `Exceeded maximum array length: The array at path '${path}' contains ${currentLength} items, which exceeds the maximum allowed length of ${maxLength}.`;
                break;
            case 'object':
                message = `Exceeded maximum object length: The object at path '${path}' contains ${currentLength} keys, which exceeds the maximum allowed length of ${maxLength}.`;
                break;
            case 'valueLength':
                message = `Exceeded maximum value length: The value at path '${path}' is ${currentLength} characters long, which exceeds the maximum allowed length of ${maxLength}.`;
                break;
            case 'valueMax':
                message = `Exceeded maximum value: The value at path '${path}' is ${currentLength}, which exceeds the maximum allowed value of ${maxLength}.`;
                break;
            default:
                message = 'Unknown error';
        }
        return { message, path, currentLength, maxLength };
    };

    /**
     * Processes an array stack item.
     * @param {Object} stackItem - The stack item to process.
     * @returns {boolean} - True if the array is valid, false otherwise.
     */
    const processArray = (stackItem) => {
        let arrayLength = stackItem.data.length;
        if (arrayLength > config.MAX_ARRAY_LENGTH) {
            errorMsgs.push(createErrorMsg('array', stackItem.path, arrayLength, config.MAX_ARRAY_LENGTH));
            return false;
        }
        for (let i = 0; i < stackItem.data.length; i++) {
            let newItem = createStackItem(stackItem, i);
            stack.push(newItem);
        }
        return true;
    };

    /**
     * Processes an object stack item.
     * @param {Object} stackItem - The stack item to process.
     * @returns {boolean} - True if the object is valid, false otherwise.
     */
    const processObject = (stackItem) => {
        let objLength = Object.keys(stackItem.data).length;
        if (objLength > config.MAX_OBJECT_LENGTH) {
            errorMsgs.push(createErrorMsg('object', stackItem.path, objLength, config.MAX_OBJECT_LENGTH));
            return false;
        }
        for (let key in stackItem.data) {
            let newItem = createStackItem(stackItem, key);
            stack.push(newItem);
        }
        return true;
    };

    /**
     * Processes a primitive stack item (string, number, boolean).
     * @param {Object} stackItem - The stack item to process.
     * @returns {boolean} - True if the primitive is valid, false otherwise.
     */
    const processPrimitive = (stackItem) => {
        stackItem.data = sanitizeValue(stackItem.data);
        setValueAtPath(originalObject, stackItem.path, stackItem.data);

        switch (typeof stackItem.data) {
            case "string":
                if (!isValidMaxLength(stackItem.data, config.MAX_VALUE_LENGTH)) {
                    errorMsgs.push(createErrorMsg('valueLength', stackItem.path, stackItem.data.toString().length, config.MAX_VALUE_LENGTH));
                    return false;
                }
                break;
            case "number":
                if (!isValidMaxValue(stackItem.data, config.MAX_VALUE_LENGTH)) {
                    errorMsgs.push(createErrorMsg('valueMax', stackItem.path, stackItem.data, config.MAX_VALUE_LENGTH));
                    return false;
                }
                break;
            case "boolean":
                break;
            default:
                break;
        }

        result.push({ ...stackItem, msg: 'valid' });
        return true;
    };

    /**
     * Processes a stack item based on its type.
     * @param {Object} stackItem - The stack item to process.
     * @returns {boolean} - True if the stack item is valid, false otherwise.
     */
    const processData = (stackItem) => {
        if (Array.isArray(stackItem.data)) return processArray(stackItem);
        if (typeof stackItem.data === "object" && stackItem.data !== null) return processObject(stackItem);
        return processPrimitive(stackItem);
    };
    /**
     * Navigates through the given object using the provided key.
     *
     * @param obj - The current object or value.
     * @param key - The key to access the next level in the object.
     * @returns The next level of the object or undefined if the key does not exist.
     */
    const navigatePath = (obj, key) => {
        if (!obj) return undefined;
        return obj[key];
    };

    /**
     * Retrieves the value from the given object based on the provided path string.
     *
     * @param obj - The root object from which the value needs to be retrieved.
     * @param path - The path string that specifies the keys to navigate through the object, separated by dots.
     * @returns The value at the specified path or undefined if the path does not exist.
     */
    const getValueFromPath = (obj, path) => {
        return path.split('.').reduce(navigatePath, obj); // Reduce to get value from path
    };

    /**
     * Creates a new stack item for traversal.
     * @param {Object} stack - The current stack.
     * @param {string|number} key - The key or index for the new stack item.
     * @returns {Object} - The new stack item.
     */
    const createStackItem = (stack, key) => {
        return {
            data: stack.data[key],
            path: stack.path ? `${stack.path}.${key}` : `${key}`,
            depth: stack.depth + 1
        };
    };

    stack.push({ data: originalObject, path: '', depth: 0, msg: '' });

    while (stack.length > 0) {
        let stackItem = stack.pop();
        if (!stackItem) continue;
        if (stackItem.depth > config.MAX_DEPTH) {
            errorMsgs.push(createErrorMsg('depth', stackItem.path, stackItem.depth, config.MAX_DEPTH));
            break;
        }
        processData(stackItem);
    }

    return { result, errorMsgs };
};