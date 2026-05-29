"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleSheetsClient = void 0;
const googleapis_1 = require("googleapis");
const getGoogleSheetsClient = () => {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const auth = new googleapis_1.google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return googleapis_1.google.sheets({ version: "v4", auth });
};
exports.getGoogleSheetsClient = getGoogleSheetsClient;
