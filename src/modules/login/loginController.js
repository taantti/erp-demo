import loginService from './services/index.js';
import { log } from '../../utils/logger.js';

export const login = async (req, res) => {
    log("INFO", "loginService.login(): ", true, req);
    const login = await loginService.login(req, res);
    log("INFO", "loginService.login(): login = " + login, true, req);
    if (!login) return res.status(404).json({ error: 'Wrong username or password' });
    res.status(200).json({ login });
};
























