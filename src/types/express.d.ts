import { JwtPayload } from "../types/common";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export { };