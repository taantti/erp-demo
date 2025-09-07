import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import config from './../../../config.js';
import { User } from '../../../models/index.js';
import { log } from '../../../utils/logger.js';


export const login = async (req, res, next) => {
    log("INFO", "loginService.js: login(): ", true, req);
    const { username, password } = req.body;

    try {
        if (!username || !password) return next(Object.assign(new Error(`Invalid credentials`), { statusCode: 401 }));
        const user = await User.findOne({ username: username });
        if (!user) return next(Object.assign(new Error(`Invalid credentials`), { statusCode: 401 }));

        if (!bcrypt.compareSync(password, user.password)) {
            return next(Object.assign(new Error(`Invalid credentials`), { statusCode: 401 }));
        }

        if (!user.active) return next(Object.assign(new Error('User is not active.'), { statusCode: 403 }));
        if (!user.role) return next(Object.assign(new Error('User has no role.'), { statusCode: 403 }));

        const payload = {
            user_id: user._id
            // TODO: User role and permissions
        }

        return jwt.sign(payload, config.JWT_SECRET_KEY, { expiresIn: config.JWT_TOKEN_EXPIRATION });
    } catch (error) {
        return next(error);
    }
};