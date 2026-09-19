import { RoleAccount } from "../models/accountAdmin";
export interface PaginationOptions {
    page: number;
    limit: number;
}

export type DataEnv = "live" | "dev";
export interface JwtPayload {
    _id: string;
    username: string;
    role: RoleAccount;
    iat?: number;
    exp?: number;
    allowedEnvs: DataEnv[];
}

export interface ReqInfor {
    ip?: string;
    userAgent?: string;
}