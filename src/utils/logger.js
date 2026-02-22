import { Log, msgMinLength, msgMaxLength } from '../models/index.js';
import { sanitizeValue } from "./sanitization.js";
import { getCurrentLocalTime } from "./auxiliary.js";
import config from '../config.js';

import { getRelativePath } from '../utils/auxiliary.js';

const logLevels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'];
const relativePath = getRelativePath(import.meta.url);

// Set log level from config or default to 'INFO'. If config.LOG_LEVEL is invalid, default to 'INFO'.
const logLevel = logLevels.includes(config.LOG_LEVEL) ? config.LOG_LEVEL : 'INFO';

/**
 * Get the tenant ID from the request object
 * @param {Object} req - The request object
 * @returns {String|null} - The tenant ID or null if not available
 */
const getTenant = (req) => {
    if (!req || !req.user || !req.user.tenant) return null;
    return req.user.tenant.id;
}

/**
 * Write a log message to the console and database
 * @param {String} logLevel - The log level ('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL').
 * @param {String} msg - The message to log.
 * @param {String|null} tenantId - The tenant ID (optional).
 */
const writeLog = (logLevel, msg, consoleOnly = false, tenantId) => {
    if (!logLevel || !msg.length) return false;
    consoleLog(logLevel, msg);
    if (!consoleOnly) databaseLog(logLevel, msg, tenantId);
}

/**
 * Log a message to the console
 * @param {String} logLevel - The log level ('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL').
 * @param {String} msg - The message to log.
 */
const consoleLog = (logLevel, msg) => {
    const sanitizedMsg = sanitizeValue(msg);
    if (sanitizedMsg.length) console.log(`${getCurrentLocalTime()}: [${logLevel}]: ${sanitizedMsg}`);
}

/**
 * Log a message to the database
 * @param {String} logLevel - The log level ('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL').
 * @param {String} msg - The message to log.
 * @param {String|null} tenantId - The tenant ID (optional).
 */
const databaseLog = async (logLevel, msg, tenantId = null) => {
    try {
        const sanitizedMsg = sanitizeValue(msg);
        if (!sanitizedMsg.length) return;
        const logEntry = await new Log({ message: sanitizedMsg, level: logLevel, tenant: tenantId, timestamp: new Date() }).save();
        return logEntry._id;
    } catch (error) {
        consoleLog('ERROR', `${relativePath}: Failed to log message to database: ${error.message}`);
    }
}

/**
 * Get the current log level index
 * -1 not found, 'DEBUG' = 0, 'INFO' = 1, 'WARN' = 2, 'ERROR' = 3, 4 = CRITICAL
 */
const getLogLevelIndex = () => logLevels.indexOf(logLevel);

/**
 * Log a message if the log level is sufficient
 * @param {String} level - The log level of the message ('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL').
 * @param {String} msg - The message to log.
 * @param {Boolean} consoleOnly - If true, log only to console, not to database.
 * @param {Object|null} req - The request object (optional).
 */
export const log = (level, msg, consoleOnly = false, req = null) => {
    if (logLevels.indexOf(level) < getLogLevelIndex()) return;
    writeLog(level, msg, consoleOnly, getTenant(req));
}
