"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleSheetsClient = void 0;
const googleapis_1 = require("googleapis");
const env_1 = __importDefault(require("../configs/env"));
const getGoogleSheetsClient = () => {
    const credentials = env_1.default.GOOGLE_CREDENTIALS;
    const auth = new googleapis_1.google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return googleapis_1.google.sheets({ version: "v4", auth });
};
exports.getGoogleSheetsClient = getGoogleSheetsClient;
