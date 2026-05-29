"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllAccounts = void 0;
const account_service_1 = require("../services/account.service");
const accountSchema_1 = require("../schemas/accountSchema");
const api_response_1 = require("../utils/api-response");
const fetchAllAccounts = async (req, res, next) => {
    try {
        const parsed = accountSchema_1.getAccountsSchema.parse(req.query);
        const data = await (0, account_service_1.getAllAccounts)(parsed);
        api_response_1.ApiResponse.ok(res, "Accounts fetched successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.fetchAllAccounts = fetchAllAccounts;
