import { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import morgan from "morgan";
import rateLimiter from "../middlewares/rateLimiter";
import hpp from "hpp";
import compression from "compression";

export const setupSecurity = (app: Express) => {

    // Helmet bảo mật header HTTP
    app.use(helmet());

    // CORS
    app.use(
        cors({
            origin: "*", // production nên whitelist domain
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
    app.use(morgan("dev"));
};
