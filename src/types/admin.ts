import { VersionType } from "../constants/version.constant";
import { RoleAccount } from "../models/accountAdmin";

export interface requestChangeRole {
    _id: string;
    role: RoleAccount
}

export interface requestGetVersionClient {
    _id: string
}

export interface requestSetVersionClient {
    type: VersionType
    version: string
}

export interface requestToggleBanUser {
    _id: string
}