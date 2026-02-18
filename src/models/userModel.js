import config from './../config.js';
import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import { roles } from "./roleModel.js";
import { log } from "../utils/logger.js";
import { checkUserTenantPermissions, getTenantIdForQuery, getTenantQueryCondition, setTenantForData, toPlainObjectIfLean } from './modelService.js';
import { sanitizeObjectFields } from '../utils/sanitization.js';
import { getRelativePath, convertToBoolean } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);
const protectedModelFields = ['password', '__v'];

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, lowercase: true, minlength: 3, maxlength: 30 },
    password: { type: String, required: true, minlength: 8, maxlength: 256 },
    first_name: { type: String, required: true, minlength: 1, maxlength: 50 },
    last_name: { type: String, required: true, minlength: 1, maxlength: 50 },
    email: { type: String, required: true, minlength: 5, maxlength: 80 },
    role: { type: String, required: true, enum: roles },
    active: { type: Boolean, required: true },
    updatedAt: Date,
    createdAt: { type: Date, default: Date.now },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
});

/**
 * Create a new user.
 * @param {Object} req - The request object.
 * @param {Object} userData - The user data to create.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object>} - The created user object.
 */
export const newUser = async (req, userData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: newUser(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);

    try {
        checkUserTenantPermissions(req, allTenants, `${relativePath}: newUser()`);
        if (!isValidRawPassword(userData.password)) {
            throw Object.assign(new Error('Password must contain at least one uppercase letter, one number, and one special character, and be at least 8 characters long.'), { statusCode: 400 });
        }
        const salt = await bcrypt.genSalt(Number(config.BCRYPT_SALT_ROUNDS));
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        userData = setTenantForData(req, userData, allTenants);
        let newUser = await new User({ ...userData, password: hashedPassword }).save();

        if (lean) newUser = newUser.toObject();
        if (sanitize) newUser = sanitizeObjectFields(newUser, protectedModelFields);
        return newUser;
    } catch (error) {
        throw error;
    }
}

/**
 * Find a user by ID.
 * @param {Object} req - The request object.
 * @param {string} userId - The ID of the user to find.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The user object if found, otherwise null.
 */
export const findUserById = async (req, userId, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findUserById(): allTenants = ${allTenants}: lean = ${lean}`, true, req);

    try {
        checkUserTenantPermissions(req, allTenants, `${relativePath}: findUserById()`);

        const tenantCondition = getTenantQueryCondition(req, req.user.tenant.id, allTenants);
        log("INFO", `${relativePath}: findUserById(): tenantCondition = ${JSON.stringify(tenantCondition)}:`, true, req);

        let user = await User.findOne({ _id: userId, ...tenantCondition }).lean(lean).exec();
        if (sanitize) user = sanitizeObjectFields(user, protectedModelFields);
        return user;
    } catch (error) {
        throw error;
    }
}

/**
 * Find users based on query parameters.
 * @param {Object} req - The request object containing user and tenant information.
 * @param {Object} params - The query parameters to filter users.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @return {Promise<Array>} - Returns an array of user objects (possibly empty array).
 * @throws {Error} - Throws if permission denied or query fails.
 */
export const findUsers = async (req, params, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findUsers(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);
    log("INFO", `${relativePath}: findUsers(): initial params = ${JSON.stringify(params)}`, true, req);

    try {
        checkUserTenantPermissions(req, allTenants, `${relativePath}: findUsers()`);
        params.tenant = getTenantIdForQuery(req, params.tenant, allTenants); // Initialize the tenant condition parameter for queries.
        if (params.active) params.active = convertToBoolean(params.active);

        let users = await User.find(params).lean(lean).exec();
        if (sanitize) users = users.map(user => sanitizeObjectFields(user, protectedModelFields));
        return users;
    } catch (error) {
        throw error;
    }
}

/**
 * Find a user by ID and update their information.
 * @param {Object} req - The request object.
 * @param {string} userId - The ID of the user to update.
 * @param {Object} userData - The new data to update the user with.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The updated user object if found and updated, otherwise null.
 */
export const findOneUserAndUpdate = async (req, userId, userData, allTenants = false, sanitize = true, lean = true) => {
    log("INFO", `${relativePath}: findOneUserAndUpdate(): allTenants = ${allTenants}: sanitize = ${sanitize}: lean = ${lean}`, true, req);

    try {
        let user = await findUserById(req, userId, allTenants, false, false);
        if (!user) throw new Error(`User with id ${userId} not found.`);

        Object.assign(user, userData); // Merge new data into the user object.
        await user.save();
        user = toPlainObjectIfLean(user, lean);
        if (sanitize) user = sanitizeObjectFields(user, protectedModelFields);
        return user;
    } catch (error) {
        throw error;
    }

}

/**
 * Model instance methods, static methods, and virtual properties are documented using JSDoc.
 * - Instance methods: @method @instance (available on user objects)
 * - Static methods: @static (available on the User class)
 * - Virtual properties: @virtual (computed properties, not stored in DB)
 * This structure improves code clarity, maintainability, and IDE support.
 */

/**
 * Compare the provided password with the user's password.
 * @param {string} candidatePassword - The password to compare.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 * @method
 * @instance
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Get the user's full name.
 * @returns {string} The full name of the user.
 * @method
 * @instance
 */
UserSchema.methods.getFullName = function () {
    return `${this.first_name} ${this.last_name}`.trim();
};

/**
 * Activate the user.
 * @returns {Promise<User>} The updated user instance.
 * @method
 * @instance
 */
UserSchema.methods.activate = async function () {
    this.active = true;
    return this.save();
};

/**
 * Deactivate the user.
 * @returns {Promise<User>} The updated user instance.
 * @method
 * @instance
 */
UserSchema.methods.deactivate = async function () {
    this.active = false;
    return this.save();
};

/**
 * Find a user by email.
 * @param {string} email - The email address of the user to find.
 * @returns {Promise<User|null>} The user object if found, null otherwise.
 * @static
 */
UserSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email.toLowerCase() });
};

/**
 * Get the user's full name (virtual property).
 * @returns {string} The full name of the user.
 * @virtual
 */
UserSchema.virtual('fullName').get(function () {
    return this.getFullName();
});

/**
 * Validate the user's email address.
 */
UserSchema.path('email').validate(function (value) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
},
    props => `${props.value} is not a valid email address.`
);

/**
 * Validate a raw (unhashed) password.
 * @param {string} password - The raw password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
const isValidRawPassword = (password) => {
    if (typeof password !== 'string') return false;
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{8,}$/.test(password);
};

/**
 * Update the user's updatedAt field before saving.
 */
UserSchema.pre('save', async function (next) {
    const user = this;
    user.updatedAt = new Date();
    return next();
});

export const User = mongoose.model('User', UserSchema);