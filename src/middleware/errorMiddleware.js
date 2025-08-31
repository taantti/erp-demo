//import { log } from '../utils/logger.js';
import config from './../config.js';


const errorHandler = (err, req, res) => {
    //log('ERROR', `${err.stack} | ${req.method} ${req.url}`, req);
    const status = err.statusCode || 500;
    const isDevelopment = config.NODE_ENV === 'development';
    return res.status(status).json({ error: isDevelopment ? err.stack : 'Internal Server Error' });
}

export default errorHandler;