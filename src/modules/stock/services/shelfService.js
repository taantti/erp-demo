import { findShelves, findShelfById, createShelf as modelCreateShelf, updateShelfById, deleteShelfById } from '../../../models/index.js';
import { log } from '../../../utils/logger.js';
import { getRelativePath } from '../../../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

export const createShelf = async (req, res, next) => {
    log("INFO", `${relativePath}: createShelf(): `, true, req);
    try {
        const shelf = await modelCreateShelf(req, req.body, false, true, true);
        return shelf;
    } catch (error) {
        return next(error);
    }
};

export const readShelf = async (req, res, next) => {
    log("INFO", `${relativePath}: readShelf(${req.params.id}): `, true, req);
    try {
        const shelf = await findShelfById(req, req.params.id, false, true, true);
        return shelf;
    } catch (error) {
        return next(error);
    }
};

export const readShelves = async (req, res, next) => {
    log("INFO", `${relativePath}: readShelves(): `, true, req);
    try {
        const shelves = await findShelves(req, req.query, false, true, true);
        return shelves;
    } catch (error) {
        return next(error);
    }
};

export const updateShelf = async (req, res, next) => {
    log("INFO", `${relativePath}: updateShelf(${req.params.id}): `, true, req);
    try {
        const shelf = await updateShelfById(req, req.params.id, req.body, false, true, true);
        return shelf;
    } catch (error) {
        return next(error);
    }
};

export const deleteShelf = async (req, res, next) => {
    log("INFO", `${relativePath}: deleteShelf(${req.params.id}): `, true, req);
    try {
        const shelf = await deleteShelfById(req, req.params.id, false);
        return shelf;
    } catch (error) {
        return next(error);
    }
};
