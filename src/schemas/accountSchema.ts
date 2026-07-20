import { z } from "zod";

export const getAccountsSchema = z.object({
    key: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});
