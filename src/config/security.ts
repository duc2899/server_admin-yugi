import { Express } from "express";
import { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import morgan from "morgan";
import rateLimiter from "../middlewares/rateLimiter";
import hpp from "hpp";
import compression from "compression";
import cookieParser from "cookie-parser";

export const setupSecurity = (app: Express) => {

    // Helmet bảo mật header HTTP
    app.use(helmet());
    app.use(cookieParser());

    // CORS
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    // Bảo vệ chống tấn công HTTP Parameter Pollution
    app.use(hpp());
    // Nén phản hồi
    app.use(
        compression({
            threshold: 1024 // chỉ nén khi > 1KB
        })
    );

    // Body parser
    app.use(bodyParser.json({ limit: "10mb" }));
    app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

    app.use(rateLimiter);

    // Logger request
    morgan.token("local-date", () => {
        return new Date().toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
        });
    });

    app.use(
        morgan((tokens, req: Request, res: Response) => {
            const status = Number(tokens.status(req, res) || 0);

            let color = "\x1b[32m"; // green
            if (status >= 400) color = "\x1b[31m"; // red
            else if (status >= 300) color = "\x1b[33m"; // yellow

            return `[${tokens["local-date"](req, res)}] ${tokens.method(
                req,
                res
            )} ${tokens.url(req, res)} ${color}${status}\x1b[0m ${tokens[
                "response-time"
            ](req, res)} ms`;
        })
    );
};
