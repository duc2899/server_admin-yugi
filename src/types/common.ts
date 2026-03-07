import { Request } from "express";
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

export interface AppRequest extends Request{
    user?: JwtPayload
}