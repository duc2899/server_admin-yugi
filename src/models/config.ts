import mongoose, { Schema } from "mongoose";

export interface IConfig {
    _id: string;
    data: Record<string, any> | any[]
}

const ConfigSchema: Schema = new Schema<IConfig>(
    {
        _id: { type: String, required: true },
        data: { type: Schema.Types.Mixed, required: true }
    }
)

const Config = mongoose.model<IConfig>("config", ConfigSchema, "config")

export default Config