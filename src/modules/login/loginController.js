import loginService from './services/index.js';

export const login = async (req, res, next) => {
    try {
        const token = await loginService.login(req);
        if (token) res.status(200).json({ login: token });
    } catch (error) {
        next(error);
    }
};

























