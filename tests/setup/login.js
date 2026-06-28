import { username_1, password_1 } from "./mockData.js";
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
        const response = await request(app).post("/login").send({ username: username_1, password: password_1, ...credentials });
        return response;
    } catch (error) {
        log("ERROR", "Error logging in:", error, true);
        return null;
    }
}