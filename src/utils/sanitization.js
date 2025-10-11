import sanitizeHtml from "sanitize-html";
import { log } from "./logger.js";
import { getRelativePath } from './auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

/**
* Sanitize an object's fields by removing specified protected fields
* @param {Object} obj - The object to sanitize.
* @param {Array} protectedFields - The fields to remove from the object.
* @returns {Object} - The sanitized object.
*/
export const sanitizeObjectFields = (obj, protectedFields = []) => {
    const sanitized = { ...obj }; // Shallow copy. Only first-level properties are copied.
    protectedFields.forEach(field => delete sanitized[field]); // Remove each protected field.
    return sanitized;
};

/**
* Sanitize an array of values
* @param {Array} arr - The array to sanitize.
* @returns {Array} - The sanitized array.
*/
export const sanitizeArray = (arr) => {
    return arr.map(item => sanitizeValue(item));
}

/**
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

/**
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

    if (typeof value === 'number' && !isValidNumber(value)) return '';
    return value;
}

/**
* Validate if a value is a number and within specified limits
* @param {Number} value - The value to validate.
* @param {Number|null} min - The minimum value (inclusive). Null means no minimum.
* @param {Number|null} max - The maximum value (inclusive). Null means no maximum.
* @returns {Boolean} - True if valid, false otherwise.
*/
export const isValidNumber = (value, min = null, max = null) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        log('WARN', `${relativePath}: isValidNumber(): Value is not a valid number.`, true);
        return false;
    }

    if (!isValidMinValue(value, min)) return false;
    if (!isValidMaxValue(value, max)) return false; 
    return true;
}

/**
 * Check if a value is less than or equal to a maximum value.
 * @param {Number} value - The value to check.
 * @param {Number} max - The maximum value.
 * @returns {Boolean} - True if valid, false otherwise.
 */
export const isValidMaxValue = (value, max) => {
    if (max !== null && value > max) {
        log('WARN', `${relativePath}: isValidMaxValue(): Value is greater than maximum (${max}).`, true);
        return false;
    }
    return true;
}

/** Check if a value is greater than or equal to a minimum value.
 * @param {Number} value - The value to check.
 * @param {Number} min - The minimum value.
 * @returns {Boolean} - True if valid, false otherwise.
 */
export const isValidMinValue = (value, min) => {
    if (min !== null && value < min) {
        log('WARN', `${relativePath}: isValidMinValue(): Value is less than minimum (${min}).`, true);
        return false;
    }
    return true;
}

/**
 * Check if a value is less than or equal to a maximum length.
 * @param {String} value - The value to check.
 * @param {Number} max - The maximum length.
 * @returns {Boolean} - True if valid, false otherwise.
 */
export const isValidMaxLength = (value, max = null) => {
    if (max !== null && value.length > max) {
        log('WARN', `${relativePath}: isValidMaxLength(): Value is greater than maximum (${max}).`, true);
        return false;
    }
    return true;
}

/** Check if a value is greater than or equal to a minimum length.
 * @param {String} value - The value to check.
 * @param {Number} min - The minimum length.
 * @returns {Boolean} - True if valid, false otherwise.
 */
export const isValidMinLength = (value, min = null) => {
    if (min !== null && value.length < min) {
        log('WARN', `${relativePath}: isValidMinLength(): Value is less than minimum (${min}).`, true);
        return false;
    }
    return true;
}

/**
* Validate if a value is a string and within specified length limits
* @param {String} value - The value to validate.
* @param {Number} minLength - The minimum length (inclusive).
* @param {Number} maxLength - The maximum length (inclusive).
* @returns {Boolean} - True if valid, false otherwise.
*/
export const isValidString = (value, minLength, maxLength) => {
    if (typeof value !== 'string') {
        log('WARN', `${relativePath}: isValidString(): Value is not a string.`, true);
        return false;

    }
    if (minLength < 0 || maxLength < 0 || minLength > maxLength) {
        log('WARN', `${relativePath}: isValidString(): Invalid minLength or maxLength values.`, true);
        return false;
    }
    return value.length >= minLength && value.length <= maxLength;
}

/**
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

