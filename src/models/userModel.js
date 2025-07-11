import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    first_name: String,
    last_name: String, 
    email: String,
    role: Enumerator,
    status: Enumerator,
    tenant: Number
});

export default User;