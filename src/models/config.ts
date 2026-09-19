import { Schema } from "mongoose";

import { VERSIONS, VersionType } from "../constants/version.constant";
import { createMultiDbModel } from "../utils/multiDbModel";

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

export const Config = createMultiDbModel<IConfig>("config", ConfigSchema, "config");
