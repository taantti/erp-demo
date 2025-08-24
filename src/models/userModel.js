import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, minlength: 3, maxlength: 30 },
    password: { type: String, required: true, minlength: 3, maxlength: 256 },
    first_name: { type: String, required: true, minlength: 1, maxlength: 50 },
    last_name: { type: String, required: true, minlength: 1, maxlength: 50 },
    email: { type: String, required: true, minlength: 5, maxlength: 80 },
    role: { type: String, required: true, enum: ['OVERSEER', 'ADMIN', 'WRITER', 'READER']},
    active: { type: Boolean, required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
});
const User = mongoose.model('User', UserSchema);
export default User;