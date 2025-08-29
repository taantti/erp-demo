import jwt from 'jsonwebtoken';
import config from '../config.js';
import { User } from '../models/index.js';

const auth = async (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1]; // Catch token_string from 'Bearer token_string'
    console.log("authMiddleware.js: token = " + token);
    if (!token) return res.status(401).json({ error: 'No token.' });

    try {
        const decodedToken = jwt.verify(token, config.JWT_SECRET_KEY);
        const user = await User.findById(decodedToken.user_id);
        if (!user || !user.active) return res.status(403).json({ error: 'No active user found.' });

        req.user = {
            userId: user._id,
            username: user.username,
            role: user.role,
            tenantId: user.tenant
        }

        return next();
    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
}

export default auth;


