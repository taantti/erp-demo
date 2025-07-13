import config from './../../../config.js';
import bcrypt from "bcrypt";
import { User } from '../../../models/index.js';


export const createUser = async (req, res) => {
    console.log("userService.js: createUser(): ");
    const {username, password, first_name: firstName, last_name: lastName, email, role, active} = req.body;
    const saltRounds = config.BCRYPT_SALT_ROUNDS | 10;

    try {
        
        //tenant = get from request user
        console.log("username = " + username);
        console.log("password = " + password);
        console.log("firstName = " + firstName);
        console.log("lastName = " + lastName);
        console.log("email = " + email);
        console.log("role = " + role);
        console.log("active = " + active);

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({username, password: hashedPassword, first_name: firstName, last_name: lastName, email, role, active});
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

        const {username, password, first_name: firstName, last_name: lastName, email, role, active} = req.body;
        const saltRounds = config.BCRYPT_SALT_ROUNDS | 10;
        const { id } = req.params;
    try {
        //tenant = get from request user
        console.log("username = " + username);
        console.log("password = " + password);
        console.log("firstName = " + firstName);
        console.log("lastName = " + lastName);
        console.log("email = " + email);
        console.log("role = " + role);
        console.log("active = " + active);

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = await User.findByIdAndUpdate(
            id,
            {username, password: hashedPassword, first_name: firstName, last_name: lastName, email, role, active},
            { new: true }
        );

        return user;

    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};


