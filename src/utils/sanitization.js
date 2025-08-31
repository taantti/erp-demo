import sanitizeHtml from "sanitize-html";
import { log } from "./logger.js";

/*
* Sanitize an array of values
* @param {Array} arr - The array to sanitize.
* @returns {Array} - The sanitized array.
*/
export const sanitizeArray = (arr) => {
    return arr.map(item => sanitizeValue(item));
}

/*
* Sanitize an object with key-value pairs
* @param {Object} obj - The object to sanitize.
* @returns {Object} - The sanitized object.
*/
export const sanitizeObject = (obj) => {
    const sanitizedObj = {};
    for (const key in obj) {
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
export const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        value = sanitizeHtml(value, { // Sanitize HTML
            allowedTags: [], // No HTML tags allowed
            allowedAttributes: {} // No attributes allowed
        }).trim(); // Remove leading/trailing whitespaces
    }
    return value;
}

/*
* Validate if a value is a string and within specified length limits
* @param {String} value - The value to validate.
* @param {Number} minLength - The minimum length (inclusive).
* @param {Number} maxLength - The maximum length (inclusive).
* @returns {Boolean} - True if valid, false otherwise.
*/
export const isValidString = (value, minLength, maxLength) => {
    if (typeof value !== 'string') {
        log('ERROR', `isValidString(): Value is not a string.`);
        return false;

    }
    if (minLength < 0 || maxLength < 0 || minLength > maxLength) {
        log('ERROR', `isValidString(): Invalid minLength or maxLength values.`);
        return false;
    }
    return value.length >= minLength && value.length <= maxLength;
}

/*
* Recursively sanitize nested JSON structures (objects and arrays)
* @param {Object|Array} data - The JSON data to sanitize.
* @returns {Object|Array} - The sanitized JSON data.
*/
export const sanitizeNestedJson = (data) => {
    if (!data) return data;
    if (Array.isArray(data)) return sanitizeArray(data);
    if (typeof data === 'object') return sanitizeObject(data);
    return data;
}

