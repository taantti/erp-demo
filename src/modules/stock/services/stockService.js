import { findStocks, findStockById, createStock as modelCreateStock, updateStockById, deleteStockById } from '../../../models/index.js';
import { log } from '../../../utils/logger.js';
import { getRelativePath } from '../../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

export const createStock = async (req, res, next) => {
    log("INFO", `${relativePath}: createStock(): `, true, req);
    try {
        const stock = await modelCreateStock(req, req.body, false, true, true);
        return stock;
    } catch (error) {
        return next(error);
    }
};

export const readStock = async (req, res, next) => {
    log("INFO", `${relativePath}: readStock(${req.params.id}): `, true, req);
    try {
        const stock = await findStockById(req, req.params.id, false, true, true);
        return stock;
    } catch (error) {
        return next(error);
    }
};

export const readStocks = async (req, res, next) => {
    log("INFO", `${relativePath}: readStocks(): `, true, req);
    try {
        const stocks = await findStocks(req, req.query, false, true, true);
        return stocks;
    } catch (error) {
        return next(error);
    }
};

export const updateStock = async (req, res, next) => {
    log("INFO", `${relativePath}: updateStock(${req.params.id}): `, true, req);
    try {
        const stock = await updateStockById(req, req.params.id, req.body, false, true, true);
        return stock;
    } catch (error) {
        return next(error);
    }
};

export const deleteStock = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteStock(${req.params.id}): `, true, req);
    try {
        const stock = await deleteStockById(req, req.params.id, false);
        return stock;
    } catch (error) {
        return next(error);
    }
};
