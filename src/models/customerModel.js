import mongoose from 'mongoose';
import { checkUserTenantPermissions, getTenantIdForQuery, getTenantQueryCondition, setTenantForData, setAutoField, AutoField } from './modelService.js';
import { sanitizeObjectFields } from '../utils/sanitization.js';
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);
const protectedModelFields = ['__v'];

/**
 * Address types
 * BILLING: A billing street address
 * SHIPPING: A shipping street address
 * HOME: A home street address
 * WORK: A work street address
 */
export const AddressTypes = {
    BILLING: 'billing',
    SHIPPING: 'shipping',
    HOME: 'home',
    WORK: 'work'
};


const PostalAddressSchema = new mongoose.Schema({
    type: { type: String, enum: Object.values(AddressTypes), required: true },
    streetAddress: { type: String, maxlength: 200 },
    city: { type: String, maxlength: 100 },
    postalCode: { type: String, maxlength: 20 },
    country: { type: String, maxlength: 100 }

});

const CustomerSchema = new mongoose.Schema({
    first_name: { type: String, required: true, minlength: 2, maxlength: 60 },
    last_name: { type: String, required: true, minlength: 2, maxlength: 60 },
    email: { type: String, maxlength: 80 },
    phone: { type: String, maxlength: 30 },
    address: { type: Map, of: PostalAddressSchema }, 
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }
});

CustomerSchema.pre('save', async function (next) {
    this.updatedAt = new Date();
    return next();
});

/**
 * Create a new customer.
 * @param {Object} req - The request object.
 * @param {Object} customerData - The customer data to create.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object>} - The created customer object.
 */
export const createCustomer = async (req, customerData, allTenants = false, sanitize = true, lean = true) => {
    checkUserTenantPermissions(req, allTenants, `${relativePath}: createCustomer()`);
    customerData = setTenantForData(req, customerData, allTenants);
    customerData = setAutoField(req, customerData, AutoField.CREATED_BY);
    let newCustomer = await new Customer({ ...customerData }).save();
    if (lean) newCustomer = newCustomer.toObject();
    if (sanitize) newCustomer = sanitizeObjectFields(newCustomer, protectedModelFields);
    return newCustomer;
};

/**
 * Find customer based on query parameters.
 * @param {Object} req - The request object.
 * @param {Object} params - The query parameters to filter customers.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Array>} - Returns an array of customer objects (possibly empty array).
 */
export const findCustomers = async (req, params = {}, allTenants = false, sanitize = true, lean = true) => {
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findCustomers()`);
    params.tenant = getTenantIdForQuery(req, params.tenant, allTenants);
    let customers = await Customer.find(params).lean(lean).exec();
    if (sanitize) customers = customers.map(s => sanitizeObjectFields(s, protectedModelFields));
    return customers;
};

/**
 * Find a customer by ID.
 * @param {Object} req - The request object.
 * @param {string} customerId - The ID of the customer to find.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The customer object if found, otherwise null.
 */
export const findCustomerById = async (req, customerId, allTenants = false, sanitize = true, lean = true) => {
    checkUserTenantPermissions(req, allTenants, `${relativePath}: findCustomerById()`);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    let customer = await Customer.findOne({ _id: customerId, ...tenantCondition }).lean(lean).exec();
    if (sanitize) customer = sanitizeObjectFields(customer, protectedModelFields);
    return customer;
};

/**
 * Find a customer by ID and update.
 * @param {Object} req - The request object.
 * @param {string} customerId - The ID of the customer to update.
 * @param {Object} customerData - The new data to update the customer with.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The updated customer object if found and updated, otherwise null.
 */
export const updateCustomerById = async (req, customerId, customerData, allTenants = false, sanitize = true, lean = true) => {
    checkUserTenantPermissions(req, allTenants, `${relativePath}: updateCustomerById()`);
    customerData = setAutoField(req, customerData, AutoField.UPDATED_BY);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    let updatedCustomer = await Customer.findOneAndUpdate({ _id: customerId, ...tenantCondition }, customerData, { new: true }).lean(lean).exec();
    if (sanitize) updatedCustomer = sanitizeObjectFields(updatedCustomer, protectedModelFields);
    return updatedCustomer;
};

/**
 * Delete a customer by ID.
 * @param {Object} req - The request object.
 * @param {string} customerId - The ID of the customer to delete.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @returns {Promise<Object|null>} - The deleted customer object if found, otherwise null.
 */
export const deleteCustomerById = async (req, customerId, allTenants = false) => {
    checkUserTenantPermissions(req, allTenants, `${relativePath}: deleteCustomerById()`);
    const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
    return await Customer.findOneAndDelete({ _id: customerId, ...tenantCondition });
};

export const Customer = mongoose.model('Customer', CustomerSchema);