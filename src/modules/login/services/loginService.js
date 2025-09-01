import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import config from './../../../config.js';
import { User } from '../../../models/index.js';
import log from '../../../utils/logger.js';


export const login = async (req, res, next) => {
    log("INFO", "loginService.js: login(): ");
    log("INFO", "req.body = " + JSON.stringify(req.body));
 
    const {username, password} = req.body;

    try {
        log("INFO", "username = " + username);
        log("INFO", "password = " + password);
        if(!username || !password) return false;

        const user = await User.findOne({username: username});
        if(!user) return false;
        log("INFO", "User exist");
        log("INFO", "user.username = " + user.username);
        log("INFO", "user.password = " + user.password);
        log("INFO", "config.JWT_SECRET_KEY = " + config.JWT_SECRET_KEY);
        log("INFO", "config.JWT_TOKEN_EXPIRATION = " + config.JWT_TOKEN_EXPIRATION);
        

        //return bcrypt.compareSync(password,  user.password);
        if(!bcrypt.compareSync(password,  user.password)) return false;
        const payload = {
            user_id: user._id
        }
        //const token = jwt.sign({user_id: user._id}, config.JWT_SECRET_KEY, {
        const token = jwt.sign(payload, config.JWT_SECRET_KEY, {
           expiresIn:  config.JWT_TOKEN_EXPIRATION
        });

        return token;

    } catch (error) {
        next(error);
    }











};