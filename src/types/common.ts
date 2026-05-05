import { RoleAccount } from "../models/accountAdmin";
export interface PaginationOptions {
    page: number;
    limit: number;
}
export interface JwtPayload {
    _id: string;
    username: string;
    role: RoleAccount;
    iat?: number
    exp?: number
}

export interface ReqInfor {
    ip?: string;
    userAgent?: string;
}