import mongoose from 'mongoose';
import { roles } from  "./roleModel.js";

const newUser = (req, allTenants = false, lean = true) => {

    // Voiko lean() lisät hakuun jälkeepäin tai hakuvaiheessa ehdollisesti?
    // Mihin fileen nämä alla olevat tarkistukset? modelService.js?

    if(!allTenants && !req?.user?.tenant) {
        aux.cLog(`userModel.js: newUser: ${allTenants }, req.tenant.admin: ${req?.user?.tenant}.`);
        return false;
    }

    if(allTenants && !req?.tenant?.admin) {
        aux.cLog(`userModel.js: newUser: ${allTenants }, req.tenant.admin: ${req?.tenant?.admin}.`);
        return false;
    }



}

const findUser = (req, allTenants = false, lean = true) => {

}

const findOneUser = (req, allTenants = false, lean = true) => {
    
}

const findOneUserAndUpdate = (req, allTenants = false, lean = true) => {
    
}

const findUserByIdAndDelete = (req, allTenants = true) => {
    
}

const findUserById = (req, allTenants = false, lean = true) => {
    
}

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, minlength: 3, maxlength: 30 },
    password: { type: String, required: true, minlength: 3, maxlength: 256 },
    first_name: { type: String, required: true, minlength: 1, maxlength: 50 },
    last_name: { type: String, required: true, minlength: 1, maxlength: 50 },
    email: { type: String, required: true, minlength: 5, maxlength: 80 },
    //role: { type: String, required: true, enum: ['OVERSEER', 'ADMIN', 'WRITER', 'READER']},
    role: { type: String, required: true, enum: roles},
    active: { type: Boolean, required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
});

const User = mongoose.model('User', UserSchema);
export default User;