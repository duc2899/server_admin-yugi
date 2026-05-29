"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSecurityHeaders = void 0;
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = __importDefault(require("../configs/env"));
const configureSecurityHeaders = (app) => {
    // Remove framework fingerprint
    app.disable("x-powered-by");
    // Helmet with explicit security policy configuration
    app.use((0, helmet_1.default)({
        xssFilter: false, // disable legacy X-XSS-Protection
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'"],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                frameAncestors: ["'none'"],
                upgradeInsecureRequests: []
            }
        },
        hsts: {
            maxAge: 63072000, // 2 years
            includeSubDomains: true,
            preload: true
        },
        referrerPolicy: {
            policy: "strict-origin-when-cross-origin"
        },
    }));
    // CORS configuration
    app.use((0, cors_1.default)({
        origin: env_1.default.CORS_ORIGIN,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    }));
    // Explicit header hardening overrides
    app.use((req, res, next) => {
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-XSS-Protection", "0"); // modern best practice
        next();
    });
};
exports.configureSecurityHeaders = configureSecurityHeaders;
