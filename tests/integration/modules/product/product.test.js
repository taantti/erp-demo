import app from "../../../../src/app.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../../setup/db.js";
import request from 'supertest';
import { createMockTenant, createMockRole, createMockUser, createMockProductCategory } from "../../../setup/mockData.js";
import { login } from "../../../setup/login.js";
import { ProductUnits } from '../../../../src/models/productModel.js';

let jwtToken = null;
let productData = null;
let createdProductId = null;
let mockProductCategoryId = null;

/**
 * Create mock data for testing
 * @returns {Promise<void>}
 */
const createMockData = async () => {
    try {
        await createMockTenant();
        await createMockRole();
        await createMockUser();
        mockProductCategoryId = (await createMockProductCategory())._id;
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
 * Test product creation endpoint
 * @returns {Promise<void>}
 */
describe('POST /product', () => {
    it('should create new product', async () => {
        productData = {
            name: "Test Product",
            sku: "TEST-PRODUCT",
            unit: ProductUnits.PIECE,
            categoryIds: [mockProductCategoryId],
            active: true
        }

        const response = await request(app).post("/product").set('Authorization', `Bearer ${jwtToken}`).send(productData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        createdProductId = response.body._id;
    })
})

/**
 * Test product retrieval endpoint
 * @returns {Promise<void>}
 */
describe('GET /product/:id', () => {
    it('should get product by id', async () => {
        const response = await request(app).get("/product/" + createdProductId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test product update endpoint
 * @returns {Promise<void>}
 */
describe('PUT /product', () => {
    it('should update product', async () => {
        productData.name = "Updated Test";
        const response = await request(app).put("/product/" + createdProductId).set('Authorization', `Bearer ${jwtToken}`).send(productData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test product deletion endpoint
 * @returns {Promise<void>}
 */
describe('DELETE /product/:id', () => {
    it('should delete product', async () => {
        const response = await request(app).delete("/product/" + createdProductId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg');
        expect(response.body.msg).toBe('Product deleted');
    })
})