import { findInventories, findInventoryById, createInventory as modelCreateInventory, updateInventoryById, deleteInventoryById } from '../../../models/index.js';
import { log } from '../../../utils/logger.js';
import { getRelativePath } from '../../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

export const createInventory = async (req, res, next) => {
    log("INFO", `${relativePath}: createInventory(): `, true, req);
    try {
        const inventory = await modelCreateInventory(req, req.body, false, true, true);
        return inventory;
    } catch (error) {
        return next(error);
    }
};

export const readInventory = async (req, res, next) => {
    log("INFO", `${relativePath}: readInventory(${req.params.id}): `, true, req);
    try {
        const inventory = await findInventoryById(req, req.params.id, false, true, true);
        return inventory;
    } catch (error) {
        return next(error);
    }
};

export const readInventories = async (req, res, next) => {
    log("INFO", `${relativePath}: readInventories(): `, true, req);
    try {
        const inventories = await findInventories(req, req.query, false, true, true);
        return inventories;
    } catch (error) {
        return next(error);
    }
};

export const updateInventory = async (req, res, next) => {
    log("INFO", `${relativePath}: updateInventory(${req.params.id}): `, true, req);
    try {
        const inventory = await updateInventoryById(req, req.params.id, req.body, false, true, true);
        return inventory;
    } catch (error) {
        return next(error);
    }
};

export const deleteInventory = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteInventory(${req.params.id}): `, true, req);
    try {
        const inventory = await deleteInventoryById(req, req.params.id, false);
        return inventory;
    } catch (error) {
        return next(error);
    }
};
