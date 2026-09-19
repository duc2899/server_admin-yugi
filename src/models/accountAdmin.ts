import { Schema } from "mongoose";
import { adminConnection } from "../configs/db";


export enum RoleAccount {
    NORMAL = "normal",
    ADMIN = "admin"
}

export interface IAccountAdmin {
    _id: string;
    username: string;
    fullName: string;
    password: string;
    avatar?: string;
    publicIdAvatar?: string;
    role: RoleAccount;
    isDisabled: boolean;
    createdTime: Date;
    updatedTime: Date;
    lastedLogin: Date | null;
}

const AccountAdminSchema: Schema = new Schema<IAccountAdmin>(
    {
        _id: { type: String, required: true },
        fullName: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        isDisabled: { type: Boolean, default: false },
        publicIdAvatar: { type: String, default: null },
        avatar: { type: String, default: null },
        role: { type: String, required: true, default: RoleAccount.NORMAL },
        createdTime: { type: Date, required: true, default: Date.now },
        updatedTime: { type: Date, required: true, default: Date.now },
        lastedLogin: { type: Date, default: null }
    }
);

const AccountAdmin = adminConnection.model<IAccountAdmin>("account", AccountAdminSchema, "account");
export default AccountAdmin;