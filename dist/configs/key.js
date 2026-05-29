"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicKey = exports.privateKey = void 0;
const env_1 = __importDefault(require("./env"));
exports.privateKey = env_1.default.PRIVATE_KEY;
exports.publicKey = env_1.default.PUBLIC_KEY;
