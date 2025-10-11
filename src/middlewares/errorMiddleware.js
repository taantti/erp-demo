import config from '../config.js';
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

    const response = {
        error: isDevelopment ? err.message + err.stack : err.message || 'Internal Server Error'
    };
    if (err.validationErrors) {
        response.errors = err.validationErrors;
    }
    return res.status(status).json(response);
}

export default errorHandler;