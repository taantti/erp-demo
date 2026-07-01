import app from "../../../../src/app.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../../setup/db.js";
import request from 'supertest';
import {
    createMockTenant, createMockRole, createMockUser,
    createMockStock, initStockData,
    createMockShelf, initShelfData,
    createMockProductCategory, initProductCategoryData,
    createMockProduct, initProductData,
    createMockInventory, initInventoryData
} from "../../../setup/mockData.js";
import { login } from "../../../setup/login.js";
import { StockEventTypes } from "../../../../src/models/stockEventModel.js";

let jwtToken = null;
let stockEventData = null;
let createdStockEventId = null;
let sourceStockId = null;
let sourceShelfId = null;
let destinationStockId = null;
let destinationShelfId = null;
let mockProductCategoryId = null;
let productId = null;
let sourceInventoryId = null;
let destinationInventoryId = null;

/**
 * Create mock data for testing
 * @returns {Promise<void>}
 */
const createMockData = async () => {
    try {
        await createMockTenant();
        await createMockRole();
        await createMockUser();

        sourceStockId = (await createMockStock(initStockData[0]))._id;
        sourceShelfId = (await createMockShelf({ ...initShelfData[0], stockId: sourceStockId }))._id;

        destinationStockId = (await createMockStock(initStockData[1]))._id;
        destinationShelfId = (await createMockShelf({ ...initShelfData[1], stockId: destinationStockId }))._id;

        mockProductCategoryId = (await createMockProductCategory())._id;
        productId = (await createMockProduct({ categoryIds: [mockProductCategoryId] }))._id;

        sourceInventoryId = (await createMockInventory({ ...initInventoryData[0], stockId: sourceStockId, shelfId: sourceShelfId, productId: productId }))._id;
        destinationInventoryId = (await createMockInventory({ ...initInventoryData[1], stockId: destinationStockId, shelfId: destinationShelfId, productId: productId }))._id;
    } catch (error) {
        console.error('MOCK DATA FAILED:', error);
        throw error;
    }
}

/**
 * Set up test environment
 * @returns {Promise<void>}
 */
beforeAll(async () => {
    await setup();
    await createMockData();
    jwtToken = (await login()).body.login;
})

/**
 * Clean up test environment
 * @returns {Promise<void>}
 */
afterAll(async () => {
    await teardown();
})

/**
 * Test stock event creation endpoint
 * @returns {Promise<void>}
 */
describe('POST /stock/event', () => {
    it('should create new stock event', async () => {
        stockEventData = {
            eventType: StockEventTypes.TRANSFER,
            sourceStockId: sourceStockId,
            sourceShelfId: sourceShelfId,
            destinationStockId: destinationStockId,
            destinationShelfId: destinationShelfId,
            productId: productId,
            quantity: 10
        };


        console.log("stockEventData = " + stockEventData);


        const response = await request(app).post("/stock/event").set('Authorization', `Bearer ${jwtToken}`).send(stockEventData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        createdStockEventId = response.body._id;
    })
})

/**
 * Test stock event retrieval endpoint
 * @returns {Promise<void>}
 */
describe('GET /stock/event/:id', () => {
    it('should get stock event by id', async () => {
        const response = await request(app).get("/stock/event/" + createdStockEventId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test stock event update endpoint
 * @returns {Promise<void>}
 */
describe('PUT /stock/event', () => {
    it('should update stock event', async () => {
        stockEventData.quantity = 11;
        const response = await request(app).put("/stock/event/" + createdStockEventId).set('Authorization', `Bearer ${jwtToken}`).send(stockEventData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test stock event deletion endpoint
 * @returns {Promise<void>}
 */
describe('DELETE /stock/event/:id', () => {
    it('should delete stock event', async () => {
        const response = await request(app).delete("/stock/event/" + createdStockEventId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg');
        expect(response.body.msg).toBe('Stock event deleted');
    })
})