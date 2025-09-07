import loginService from './services/index.js';
import { log } from '../../utils/logger.js';

export const login = async (req, res, next) => {
    log("INFO", "loginService.login(): ", true, req);
    try {
        const token = await loginService.login(req, res, next);
        if (token) res.status(200).json({ login: token });
    } catch (error) {
        next(error);
    }
};

























