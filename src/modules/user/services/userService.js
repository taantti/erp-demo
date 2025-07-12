import config from './../../../config.js';
import bcrypt from "bcrypt";
import { User } from '../../../models/index.js';


export const createUser = async (req, res) => {
    console.log("userService.js: createUser(): ");
    const {username, plain_text_password, first_name, last_name,email, role, active} = req.body;
    const saltRounds = config.BCRYPT_SALT_ROUNDS | 10;

    try {
        
        //tenant = get from request user
        console.log("username = " + username);
        console.log("plain_text_password = " + plain_text_password);
        console.log("first_name = " + first_name);
        console.log("last_name = " + last_name);
        console.log("email = " + email);
        console.log("role = " + role);
        console.log("active = " + active);

        const salt = bcrypt.genSaltSync(saltRounds);
        const password = bcrypt.hashSync(plain_text_password, salt);

        const user = new User({username, password, first_name, last_name, email, role, active});
        return user.save();
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

export const deleteUser = async (req, res) => {
    console.log("userService.js: deleteUser(" + req.params.id + "): ");
    try {
        //res.status(501).json({ message: 'Not Implemented yet'});
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        return user;
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

export const readUser = async (req, res) => {
    console.log("userService.js: readUser(" + req.params.id + "): ");
    try {
        return User.findById(req.params.id);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

export const readUsers = async (req, res) => {  
    try {
        const ids = req.params.ids.split(',');
        console.log("userService.js: readUsers(" + ids + "): ");
        return await User.find({ _id: { $in: ids } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    console.log("userService.js: updateUser(" + req.params.id + "): ");
    try {
        const {firstname, lastname, username, password} = req.body;
        const { id } = req.params;
        console.log("id = " + id);
        console.log("firstname = " + firstname);
        console.log("lastname = " + lastname);
        console.log("username = " + username);
        console.log("password = " + password);

        const user = await User.findByIdAndUpdate(
            id,
            {name, username, password},
            { new: true }
        );

        return user;

    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};


