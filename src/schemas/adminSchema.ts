import z from "zod";
import { RoleAccount } from "../models/accountAdmin";
import { VERSIONS } from "../constants/version.constant";

export const versionSchema = z
    .string()
    .regex(/^\d+\.\d+$/, "Version must be in format x.y (ex: 1.107)");

export const changeRoleSchema = z.object({
    _id: z.string(),
    role: z.enum(RoleAccount, "Invalid Role")
})

export const setVersionClientSchema = z.object({
    version: versionSchema,
    type: z.enum(VERSIONS, "Invalid Version")
})


export const toggleBanSchema = z.object({
    _id: z.string(),
})
