import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    //first_name: String,
    //last_name: String, 
    //email: String,
    //role: Enumerator,
    //status: Enumerator,
    //client: Number
});

const User = mongoose.model('User', userSchema); // SELECT id, name, ...
export default User;