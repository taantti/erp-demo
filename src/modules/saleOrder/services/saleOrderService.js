import {
    findSaleOrders, findSaleOrderById, createSaleOrder as modelSaleOrder, updateSaleOrderById, deleteSaleOrderById,
    findSOItems, findSOItemById, createSOItem, updateSOItemById, deleteSOItemById
} from '../../../models/index.js';

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const createSaleOrder = async (req) => {
    return await modelSaleOrder(req, req.body, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readSaleOrder = async (req) => {
    return await findSaleOrderById(req, req.params.id, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readSaleOrders = async (req) => {
    return await findSaleOrders(req, req.query, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const updateSaleOrder = async (req) => {
    return await updateSaleOrderById(req, req.params.id, req.body, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const deleteSaleOrder = async (req) => {
    return await deleteSaleOrderById(req, req.params.id, false);
};


/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const createItem = async (req) => {
    return await createSOItem(req, req.params.id, req.body, false);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readItem = async (req) => {
    return await findSOItemById(req, req.params.id, req.params.itemId, false);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readItems = async (req) => {
    return await findSOItems(req, req.params.id, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const updateItem = async (req) => {
    return await updateSOItemById(req, req.params.id, req.params.itemId, req.body, false);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const deleteItem = async (req) => {
    return await deleteSOItemById(req, req.params.id, req.params.itemId, false);
};

