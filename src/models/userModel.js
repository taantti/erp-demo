import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String, 
    username: String,
    pasword: String 
});

const User = mongoose.model('User', userSchema);
export default User;