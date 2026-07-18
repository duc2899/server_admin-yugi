import { z } from "zod";

export const getAccountsSchema = z.object({
    key: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    isAll: z
        .preprocess((val) => {
            if (val === "true" || val === true) return true;
            if (val === "false" || val === false) return false;
            return undefined; // để nó rơi vào giá trị default nếu không truyền
        }, z.boolean())
        .default(false) // Tự động là false nếu client không truyền lên
});
