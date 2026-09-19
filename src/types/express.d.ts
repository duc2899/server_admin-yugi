import { Model } from "mongoose";
import { JwtPayload } from "../types/common";
import { DataModels } from "../models/registry";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      models: DataModels;
      dataEnv: DataEnv;
    }
  }
}

export { };