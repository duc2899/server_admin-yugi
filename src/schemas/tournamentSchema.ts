import { z } from "zod";

export const getTournamentSchema = z.object({
    name: z.string().optional(),
    type: z.string().optional(),
    status: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});