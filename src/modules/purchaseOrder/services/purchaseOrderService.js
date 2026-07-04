import {
    findPurchaseOrders, findPurchaseOrderById, createPurchaseOrder as modelPurchaseOrder, updatePurchaseOrderById, deletePurchaseOrderById,
    findPOItems, findPOItemById, createPOItem, updatePOItemById, deletePOItemById
} from '../../../models/index.js';

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const createPurchaseOrder = async (req) => {
    return await modelPurchaseOrder(req, req.body, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readPurchaseOrder = async (req) => {
    return await findPurchaseOrderById(req, req.params.id, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readPurchaseOrders = async (req) => {
    return await findPurchaseOrders(req, req.query, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const updatePurchaseOrder = async (req) => {
    return await updatePurchaseOrderById(req, req.params.id, req.body, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const deletePurchaseOrder = async (req) => {
    return await deletePurchaseOrderById(req, req.params.id, false);
};


/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const createItem = async (req) => {
    return await createPOItem(req, req.params.id, req.body, false);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readItem = async (req) => {
    return await findPOItemById(req, req.params.id, req.params.itemId, false);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const readItems = async (req) => {
    return await findPOItems(req, req.params.id, false, true, true);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const updateItem = async (req) => {
    return await updatePOItemById(req, req.params.id, req.params.itemId, req.body, false);
};

/**
 * @param {Object} req - Express request object
 * @returns {Promise<any>}
 */
export const deleteItem = async (req) => {
    return await deletePOItemById(req, req.params.id, req.params.itemId, false);
};

