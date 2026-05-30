"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.envSchema = void 0;
require("dotenv-flow/config");
const zod_1 = require("zod");
/**
 * Environment variable schema
 * - All validation happens at startup
 * - Fails fast on misconfiguration
 */
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: zod_1.z.string().regex(/^\d+$/, "PORT must be a number").transform(Number),
    DATABASE_URL: zod_1.z.url(),
    CORS_ORIGIN: zod_1.z.string(),
    LOG_LEVEL: zod_1.z
        .enum(["fatal", "error", "warn", "info", "debug", "trace"])
        .default("info"),
    PRIVATE_KEY: zod_1.z.string(),
    PUBLIC_KEY: zod_1.z.string(),
    REDIS_USERNAME: zod_1.z.string(),
    REDIS_PASSWORD: zod_1.z.string(),
    REDIS_HOST: zod_1.z.string(),
    REDIS_PORT: zod_1.z.string().regex(/^\d+$/, "REDIS_PORT must be a number").transform(Number),
    // JWT_REFRESH_SECRET: z.string().min(32),
    // CRYPTO_SECRET: z.string().min(32),
    // SMTP_HOST: z.string(),
    // SMTP_PORT: z
    //   .string()
    //   .regex(/^\d+$/, "SMTP_PORT must be a number")
    //   .transform(Number),
    // SMTP_USER: z.string(),
    // SMTP_PASS: z.string(),
    // EMAIL_FROM: z.email(),
    // GOOGLE_CLIENT_ID: z.string(),
    // GOOGLE_CLIENT_SECRET: z.string(),
    // GOOGLE_REDIRECT_URI: z.url(),
    // GITHUB_CLIENT_ID: z.string(),
    // GITHUB_CLIENT_SECRET: z.string(),
    // GITHUB_REDIRECT_URI: z.url()
    CLOUDINARY_CLOUD_NAME: zod_1.z.string(),
    CLOUDINARY_API_KEY: zod_1.z.string(),
    CLOUDINARY_API_SECRET: zod_1.z.string(),
    GOOGLE_CREDENTIALS: zod_1.z.string().transform((str) => {
        try {
            return JSON.parse(str);
        }
        catch (error) {
            throw new Error("GOOGLE_CREDENTIALS must be a valid JSON string");
        }
    }),
});
/**
 * Parse and validate environment variables once.
 * This module must be imported before app bootstrap.
 */
const result = exports.envSchema.safeParse(process.env);
if (!result.success) {
    console.error("❌ Invalid environment configuration");
    console.error(zod_1.z.prettifyError(result.error));
    process.exit(1);
}
/**
 * Validated, immutable environment object
 */
exports.env = Object.freeze(result.data);
exports.default = exports.env;
