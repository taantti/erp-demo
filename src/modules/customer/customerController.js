import { customerService } from './services/index.js';

/**
 * Read all customers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readCustomers = async (req, res, next) => {
    try {
        const customers = await customerService.readCustomers(req);
        res.status(200).json(customers);
    } catch (error) {
        return next(error);
    }
};

/**
 * Read a single customer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const readCustomer = async (req, res, next) => {
    try {
        const customer = await customerService.readCustomer(req);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.status(200).json(customer);
    } catch (error) {
        return next(error);
    }
};

/**
 * Create a new customer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createCustomer = async (req, res, next) => {
    try {
        const newCustomer = await customerService.createCustomer(req);
        if (!newCustomer) return res.status(400).json({ error: 'Customer not created' });
        res.status(201).json(newCustomer);
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a customer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateCustomer = async (req, res, next) => {
    try {
        const updatedCustomer = await customerService.updateCustomer(req);
        if (!updatedCustomer) return res.status(404).json({ error: 'Customer not found' });
        res.status(200).json(updatedCustomer);
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete a customer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteCustomer = async (req, res, next) => {
    try {
        const deletedCustomer = await customerService.deleteCustomer(req);
        if (!deletedCustomer) return res.status(404).json({ error: 'Customer not found' });
        res.status(200).json({ msg: 'Customer deleted' });
    } catch (error) {
        return next(error);
    }
};

