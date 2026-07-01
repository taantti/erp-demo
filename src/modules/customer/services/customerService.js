import { findCustomers, findCustomerById, createCustomer as modelCreateCustomer, updateCustomerById, deleteCustomerById } from '../../../models/index.js';

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const createCustomer = async (req) => {
    return await modelCreateCustomer(req, req.body, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readCustomer = async (req) => {
    return await findCustomerById(req, req.params.id, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readCustomers = async (req) => {
    return await findCustomers(req, req.query, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const updateCustomer = async (req) => {
    return await updateCustomerById(req, req.params.id, req.body, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const deleteCustomer = async (req) => {
    return await deleteCustomerById(req, req.params.id, false);
};
