import { RoleAdmin } from "../models/accountAdmin";

export interface requestRegisterAccountAdmin {
    username: string;
    password: string;
    fullName: string;
}

export interface requestLoginAccountAdmin {
    username: string;
    password: string;
}

export interface requestChangeRoleAccountAdmin {
    _id: string;
    role: RoleAdmin
}
