import mongoose, { Schema } from "mongoose";


export enum RoleAdmin {
    NORMAL = "normal",
    ADMIN = "admin"
}

export interface IAccountAdmin {
    _id: string;
    username: string;
    fullName: string;
    password: string;
    role: RoleAdmin;
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
        role: { type: String, required: true, default: RoleAdmin.NORMAL },
        createdTime: { type: Date, required: true, default: Date.now },
        updatedTime: { type: Date, required: true, default: Date.now },
        lastedLogin: { type: Date, default: null }
    }
);

const AccountAdmin = mongoose.model<IAccountAdmin>("account_admin", AccountAdminSchema, "account_admin");
export default AccountAdmin;