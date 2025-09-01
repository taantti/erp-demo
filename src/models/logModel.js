import mongoose from 'mongoose';
import { log } from  "../utils/logger.js";
export const msgMinLength = 1;
export const msgMaxLength = 1200;
const logLevels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];

const LogSchema = new mongoose.Schema({
    level: { type: String, required: true, enum: logLevels, default: 'INFO' },
    message: { type: String, required: true, minlength: msgMinLength, maxlength: msgMaxLength },
    date_time: { type: Date, default: Date.now },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: false },
});

export const Log = mongoose.model('Log', LogSchema);

/* No implementation yet
export const findLog = (req, allTenants = false) => {

}

export const findOneLog = (req, allTenants = false) => {
      if(!allTenants && !req.user?.tenant) {
        log('', '');
        return false;
    }  
}

export const findLogByIdAndDelete = (req, allTenants = false) => {
        if(!allTenants && !req.user?.tenant) {
        log('', '');
        return false;
    }
}

export const findLogById = (req, allTenants = false) => {
        if(!allTenants && !req.user?.tenant) {
        log('', '');
        return false;
    }
}
*/
