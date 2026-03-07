import z from "zod";
import { RoleAdmin } from "../models/accountAdmin";

export const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must be between 3 and 20 characters"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(15, "Password must be between 6 and 15 characters"),
    fullName: z.string().min(3, "Full name must be at least 3 characters long").max(50, "Full name must be between 3 and 50 characters"),
});


export const loginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must be between 3 and 20 characters"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(15, "Password must be between 6 and 15 characters"),
});

export const changeRoleSchema = z.object({
    _id: z.string(),
    role: z.enum(RoleAdmin, "Invalid Role")
})