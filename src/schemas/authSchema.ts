import z from "zod";
import { MAX_FULLNAME_LENGTH, MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH, MIN_FULLNAME_LENGTH, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from "../constants/common";

export const registerSchema = z.object({
    username: z.string().min(MIN_USERNAME_LENGTH, `Username must be at least ${MIN_USERNAME_LENGTH} characters`).max(MAX_USERNAME_LENGTH, `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters`),
    password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`).max(MAX_PASSWORD_LENGTH, `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`),
    fullName: z.string().min(MIN_FULLNAME_LENGTH, `Full name must be at least ${MIN_FULLNAME_LENGTH} characters`).max(MAX_FULLNAME_LENGTH, `Full name must be between ${MIN_FULLNAME_LENGTH} and ${MAX_FULLNAME_LENGTH} characters`),
});


export const loginSchema = z.object({
    username: z.string().min(MIN_USERNAME_LENGTH, `Username must be at least ${MIN_USERNAME_LENGTH} characters`).max(MAX_USERNAME_LENGTH, `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters`),
    password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`).max(MAX_PASSWORD_LENGTH, `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`),
});

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(MIN_PASSWORD_LENGTH, `Old password must be at least ${MIN_PASSWORD_LENGTH} characters`).max(MAX_PASSWORD_LENGTH, `Old password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`),
    newPassword: z.string().min(MIN_PASSWORD_LENGTH, `New password must be at least ${MIN_PASSWORD_LENGTH} characters`).max(MAX_PASSWORD_LENGTH, `New password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`),
});
