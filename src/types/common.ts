import { RoleAdmin } from "../models/accountAdmin";
export interface PaginationOptions {
    page: number;
    limit: number;
}
export interface JwtPayload {
    _id: string;
    username: string;
    role: RoleAdmin;
}

export interface ReqInfor {
    ip?: string;
    userAgent?: string;
}