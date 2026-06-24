import app from "../../../../src/app.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setup, teardown } from "../../../setup/db.js";
import request from 'supertest';
import { createMockTenant, createMockRole, createMockUser } from "../../../setup/mockData.js";
import { login } from "../../../setup/login.js";

let jwtToken = null;
let categoryData = null;
let createdCategoryId = null;

/**
 * Create mock data for testing
 * @returns {Promise<void>}
 */
const createMockData = async () => {
    try {
        await createMockTenant();
        await createMockRole();
        await createMockUser();
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
 * Test category creation endpoint
 * @returns {Promise<void>}
 */
describe('POST /product/category', () => {
    categoryData = {
        name: "Test Category",
        slug: "test-category",
        active: true
    }

    it('should create new category', async () => {
        const response = await request(app).post("/product/category").set('Authorization', `Bearer ${jwtToken}`).send(categoryData);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        createdCategoryId = response.body._id;
    })
})

/**
 * Test category retrieval endpoint
 * @returns {Promise<void>}
 */
describe('GET /product/category/:id', () => {
    it('should get category by id', async () => {
        const response = await request(app).get("/product/category/" + createdCategoryId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test category update endpoint
 * @returns {Promise<void>}
 */
describe('PUT /product/category', () => {
    it('should update category', async () => {
        categoryData.name = "Updated Test";
        const response = await request(app).put("/product/category/" + createdCategoryId).set('Authorization', `Bearer ${jwtToken}`).send(categoryData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
    })
})

/**
 * Test category deletion endpoint
 * @returns {Promise<void>}
 */
describe('DELETE /product/category/:id', () => {
    it('should delete category', async () => {
        const response = await request(app).delete("/product/category/" + createdCategoryId).set('Authorization', `Bearer ${jwtToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg');
        expect(response.body.msg).toBe('Category deleted');
    })
})