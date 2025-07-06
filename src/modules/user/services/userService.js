import { User } from '../../../models/index.js';

export const createUser = async (req, res) => {
    console.log("userService.js: createUser(): ");
    try {
        const {firstname, username, password} = req.body;
        console.log("firstname = " + firstname);
        console.log("username = " + username);
        console.log("password = " + password);

        const user = new User({username, password})
        //const newUser = await user.save();
        //res.status(201).json(newUser); 

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
        const {name, username, password} = req.body;
        const { id } = req.params;
        console.log("id = " + id);
        console.log("firstname = " + name);
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


