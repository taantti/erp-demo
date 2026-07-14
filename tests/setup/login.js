import mockData from "./mockData/index.js";
import request from 'supertest';
import app from "../../src/app.js";
import { log } from "../../src/utils/logger.js";

/**
 * Login with mock credentials
 * @param {Object} credentials - Optional credentials to override defaults
 * @returns {Promise<any>}
 */
export const login = async (credentials = null) => {
    try {
        const response = await request(app).post("/login").send({ username: mockData.user[0].username, password: mockData.user[0].password, ...credentials });
        return response;
    } catch (error) {
        log("ERROR", "Error logging in:", error, true);
        return null;
    }
}