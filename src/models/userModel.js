import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    first_name: String,
    last_name: String, 
    email: String,
    role: String,
    active: Boolean,
    tenant: Number
});
const User = mongoose.model('User', userSchema);
export default User;