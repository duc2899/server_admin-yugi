import z from "zod";

const mailRewardSchema = z
    .object({
        type: z.string().min(1),
        code: z.string().optional().nullable(),
        qty: z.coerce.number().int().positive(),
    })
    .superRefine((reward, ctx) => {
        const type = reward.type.trim().toUpperCase();
        if (type === "CARD") {
            if (!reward.code || !String(reward.code).trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "CARD reward requires code",
                    path: ["code"],
                });
            }
        } else if (type === "RUBY") {
            // ok
        } else {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Unsupported reward type: ${reward.type}`,
                path: ["type"],
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

export const listMailQuerySchema = z.object({
    accountId: z.union([z.string(), z.number()]).optional(),
    username: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});
