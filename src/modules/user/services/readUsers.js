import { User } from '../../../models/index.js';
export const readUsers = async (req, res) => {
    try {
        console.log("ids", req.params.ids);
        const ids = req.params.ids.split(',');
        const users = await User.find({ _id: { $in: ids } });
        if (!users) return res.status(404).json({ error: 'Users not found' });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};