import cors from "cors";
import { Express } from "express";
import helmet from "helmet";
import env from "../configs/env";

export const configureSecurityHeaders = (app: Express) => {
    // Remove framework fingerprint
    app.disable("x-powered-by");

    // Helmet with explicit security policy configuration
    app.use(
        helmet({
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
        })
    );

    // CORS configuration
    app.use(
        cors({
            origin: env.CORS_ORIGIN,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
        })
    );

    // Explicit header hardening overrides
    app.use((req, res, next) => {
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-XSS-Protection", "0"); // modern best practice
        next();
    });
};