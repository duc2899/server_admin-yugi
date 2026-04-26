import { z } from "zod";
import { LOG_ACTIONS } from "../constants/activityLog..constant";

export const getActivityLogSchema = z.object({
    action:  z.enum(LOG_ACTIONS).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});
