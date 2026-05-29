"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSecurity = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const rateLimiter_1 = __importDefault(require("../middlewares/rateLimiter"));
const hpp_1 = __importDefault(require("hpp"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const security_header_1 = require("../middlewares/security-header");
const setupSecurity = (app) => {
    (0, security_header_1.configureSecurityHeaders)(app);
    app.use((0, cookie_parser_1.default)());
    // Bảo vệ chống tấn công HTTP Parameter Pollution
    app.use((0, hpp_1.default)());
    // Nén phản hồi
    app.use((0, compression_1.default)({
        threshold: 1024 // chỉ nén khi > 1KB
    }));
    // Body parser
    app.use(body_parser_1.default.json({ limit: "10mb" }));
    app.use(body_parser_1.default.urlencoded({ extended: true, limit: "10mb" }));
    app.set("trust proxy", 1); // nếu app chạy sau proxy (ví dụ: Nginx)
    app.use(rateLimiter_1.default);
    // Logger request
    morgan_1.default.token("local-date", () => {
        return new Date().toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
        });
    });
    app.use((0, morgan_1.default)((tokens, req, res) => {
        const status = Number(tokens.status(req, res) || 0);
        let color = "\x1b[32m"; // green
        if (status >= 400)
            color = "\x1b[31m"; // red
        else if (status >= 300)
            color = "\x1b[33m"; // yellow
        return `[${tokens["local-date"](req, res)}] ${tokens.method(req, res)} ${tokens.url(req, res)} ${color}${status}\x1b[0m ${tokens["response-time"](req, res)} ms`;
    }));
};
exports.setupSecurity = setupSecurity;
