import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import config from './../../../config.js';
import { User } from '../../../models/index.js';


export const login = async (req, res) => {
    console.log("req.body", req.body);
    console.log("loginService.js: login(): ");
    const {username, password} = req.body;

    try {
        console.log("username = " + username);
        console.log("password = " + password);

        const user = await User.findOne({username: username});
        if(!user) return false;
        console.log("User exist");
        console.log("user.username", user.username);
        console.log("user.password", user.password);

        console.log("config.JWT_SECRET_KEY", config.JWT_SECRET_KEY);
        console.log("config.JWT_TOKEN_EXPIRATION", config.JWT_TOKEN_EXPIRATION);
        

        //return bcrypt.compareSync(password,  user.password);
        if(!bcrypt.compareSync(password,  user.password)) return false;

        const token = jwt.sign({user_id: user._id}, config.JWT_SECRET_KEY, {
           expiresIn:  config.JWT_TOKEN_EXPIRATION
        });

        return token;

        //res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }











};