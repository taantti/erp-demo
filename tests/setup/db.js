import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { log } from "../../src/utils/logger.js";

/**
 * Holds the running in-memory MongoDB replica set so teardown() can stop it.
 * @type {MongoMemoryReplSet | null}
 */
let replSet = null;

/**
 * Start an in-memory MongoDB replica set and connect Mongoose to it.
 * A single-node replica set is used so multi-document transactions work.
 * @returns {Promise<void>}
 */
const connect = async () => {
    replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    await mongoose.connect(replSet.getUri());
    log("INFO", "Connected to in-memory MongoDB replica set", true);
}

/**
 * Disconnect Mongoose and stop the in-memory replica set.
 * @returns {Promise<void>}
 */
const disconnect = async () => {
    await mongoose.disconnect();
    await replSet.stop();
    log("INFO", "Stopped in-memory replica set", true);
}

/**
 * Set up the test database. Call in beforeAll.
 * @returns {Promise<void>}
 */
export const setup = async () => {
    await connect();
}

/**
 * Tear down the test database. Call in afterAll.
 * @returns {Promise<void>}
 */
export const teardown = async () => {
    await disconnect();
}


