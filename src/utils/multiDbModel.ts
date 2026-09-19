// utils/multiDbModel.ts
import { Schema, Connection, Model } from "mongoose";

export function createMultiDbModel<T>(
    name: string,
    schema: Schema<T>,
    collectionName?: string // thêm param optional
) {
    return (connection: Connection): Model<T> => {
        return (
            (connection.models[name] as Model<T>) ??
            connection.model<T>(name, schema, collectionName)
        );
    };
}