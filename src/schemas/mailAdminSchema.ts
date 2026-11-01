import z from "zod";
import { MailRewardType } from "../constants/mail.constant";

const mailRewardSchema = z
    .object({
        type: z.enum([MailRewardType.CARD, MailRewardType.RUBY]),
        code: z.string().optional().nullable(),
        qty: z.coerce
            .number()
            .int("Số lượng phải là số nguyên")
            .min(1, "Số lượng phải lớn hơn hoặc bằng 1"),
    })
    .superRefine((reward, ctx) => {
        if (reward.type === MailRewardType.CARD && !reward.code?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "CARD reward requires code",
                path: ["code"],
            });
        }
    });

export const sendMailSchema = z.object({
    accountIds: z
        .array(z.union([z.string(), z.number()]))
        .min(1, "At least one recipient is required")
        .max(50, "Too many recipients"),
    title: z.string().min(1).max(200),
    body: z.string().max(5000).default(""),
    rewards: z.array(mailRewardSchema).default([]),
});

export const searchMailRecipientsSchema = z.object({
    q: z.string().trim().min(1).max(100),
    limit: z.coerce.number().int().positive().max(20).default(10),
});

export const recallMailParamsSchema = z.object({
    id: z.union([z.string(), z.number()]),
});

export const listMailQuerySchema = z.object({
    accountId: z.union([z.string(), z.number()]).optional(),
    username: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});
