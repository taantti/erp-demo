import { log } from '../utils/logger.js';
const errorHandler = (err, req, res, next) => {
    log('ERROR', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
}

export default errorHandler;