"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../configs/db");
const accountAdmin_1 = __importDefault(require("../models/accountAdmin"));
async function migrate() {
    try {
        (0, db_1.connectDB)();
        await accountAdmin_1.default.updateMany({ lastedLogin: { $exists: false } }, { $set: { lastedLogin: null } });
        console.log("Done");
        process.exit(0);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
migrate();
