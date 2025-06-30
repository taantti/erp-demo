import jsonwebtoken from 'jsonwebtoken';



export const login = async (req, res) => {
    console.log("req.body", req.body);
    try {
        res.status(501).json({ message: 'Not Implemented yet'});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};