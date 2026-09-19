// middlewares/withDataEnv.ts
import type { Response, NextFunction, Request } from "express";
import { getDataConnection } from "../configs/db";
import { getModelsForConnection } from "../models/registry";
import { DataEnv } from "../types/common";
import throwError from "../utils/throwError";

export const withDataEnv = (req: Request, res: Response, next: NextFunction) => {
    const requested = (req.headers["x-data-env"] as string) === "live" ? "live" : "dev";

    if (!req.user?.allowedEnvs.includes(requested)) {
        return throwError("You can only access data from allowed environments", 403);
    }

    const dataEnv: DataEnv = requested;
    const connection = getDataConnection(dataEnv);

    req.dataEnv = dataEnv;
    req.models = getModelsForConnection(connection);

    next();
};