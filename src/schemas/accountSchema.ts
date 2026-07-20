import { z } from "zod";

export const getAccountsSchema = z.object({
    key: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    isAll: z
        .preprocess((val) => {
            // Nhận cả 1, "1", true, "true" để CHẮC CHẮN không bị lọt
            return val === "1" || val === 1 || val === "true" || val === true;
        }, z.boolean())
        .default(false)
});
