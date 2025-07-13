import bcrypt from "bcrypt";
import jsonwebtoken from 'jsonwebtoken';
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

        return bcrypt.compareSync(password,  user.password);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }











};