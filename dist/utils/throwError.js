"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const throwError = (message, statusCode, returnCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.returnCode = returnCode;
    throw error;
};
exports.default = throwError;
