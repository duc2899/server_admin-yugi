import mongoose, { Schema } from "mongoose";
import { VERSIONS, VersionType } from "../constants/version.constant";

export interface IConfig {
    _id: VersionType;
    data: Record<string, any> | any[]
}

const ConfigSchema: Schema = new Schema<IConfig>(
    {
        _id: { type: String, enum: VERSIONS, required: true },
        data: { type: Schema.Types.Mixed, required: true }
    }
)

const Config = mongoose.model<IConfig>("config", ConfigSchema, "config")

export default Config