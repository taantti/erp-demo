//import { log } from '../utils/logger.js';
import config from './../config.js';
import { log } from '../utils/logger.js';

/**
 * Error handling middleware
 * @param {Object} err - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The Express response object with error message.
 */
const errorHandler = (err, req, res, next) => {
    log('ERROR', `${err.stack} | ${req.method} ${req.url}`, false, req);
    const status = err.statusCode || 500;
    const isDevelopment = config.NODE_ENV === 'development';
    return res.status(status).json({ error: isDevelopment ? err.stack : 'Internal Server Error' });
}

export default errorHandler;