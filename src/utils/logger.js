import { Log, msgMinLength, msgMaxLength } from '../models/index.js';
import { sanitizeValue } from "./sanitization.js";
import { getCurrentLocalTime } from "./auxiliary.js";
import config from '../config.js';
const logLevels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];

// Set log level from config or default to 'INFO'. If config.LOG_LEVEL is invalid, default to 'INFO'.
const logLevel = logLevels.includes(config.LOG_LEVEL) ? config.LOG_LEVEL : 'INFO';

/*
 * Get the tenant ID from the request object
 */
const getTenant = (req) => {
    if (!req || !req.user || !req.user.tenant) return null;
    return req.user.tenant;
}

/*
 * Write a log message to the console and database
 * @param {String} logLevel - The log level ('DEBUG', 'INFO', 'WARN', 'ERROR').
 * @param {String} msg - The message to log.
 * @param {String|null} tenantId - The tenant ID (optional).
 */
const writeLog = (logLevel, msg, tenantId) => {
    if (!logLevel) return;
    consoleLog(logLevel, msg);
    databaseLog(logLevel, msg, tenantId);
}

/*
 * Log a message to the console
 * @param {String} logLevel - The log level ('DEBUG', 'INFO', 'WARN', 'ERROR').
 * @param {String} msg - The message to log.
 */
const consoleLog = (logLevel, msg) => {
    const sanitizedMsg = sanitizeValue(msg);
    if (sanitizedMsg.length) console.log(`${getCurrentLocalTime()}: [${logLevel}]: ${sanitizedMsg}`);
}

/*
 * Log a message to the database
 * @param {String} logLevel - The log level ('DEBUG', 'INFO', 'WARN', 'ERROR').
 * @param {String} msg - The message to log.
 * @param {String|null} tenantId - The tenant ID (optional).
 */
const databaseLog = async (logLevel, msg, tenantId = null) => {
    try {
        const sanitizedMsg = sanitizeValue(msg);
        if (!sanitizedMsg.length) return;
        await new Log({ message: msg, level: logLevel, tenant: tenantId, timestamp: new Date() }).save();
    } catch (error) {
        consoleLog('ERROR', `Failed to log message to database: ${error.message}`);
    }
}

/*
 * Get the current log level index
 * -1 not found, 'DEBUG' = 0, 'INFO' = 1, 'WARN' = 2, 'ERROR' = 3
 */
const getLogLevelIndex = () => logLevels.indexOf(logLevel);

export const log = (level, msg, req = null) => {
    if (logLevels.indexOf(level) < getLogLevelIndex()) return;
    writeLog(level, msg, getTenant(req));
}






