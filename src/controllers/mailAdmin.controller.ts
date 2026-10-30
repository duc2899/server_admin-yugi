import { Request, Response } from "express";
import { listMailQuerySchema, sendMailSchema } from "../schemas/mailAdminSchema";
import { listMailsAdmin, sendMailAdmin } from "../services/mailAdmin.service";
import { createActivityLogService } from "../services/activityLog.service";

export const sendMailController = async (req: Request, res: Response) => {
    try {
        const parsed = sendMailSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid request",
                errors: parsed.error.flatten(),
            });
        }

        const mail = await sendMailAdmin(req.models.Mail, req.models.Account, {
            ...parsed.data,
            createdBy: req.user?.username,
        });

        await createActivityLogService({
            userId: String(req.user?._id ?? ""),
            username: req.user?.username,
            action: "SEND_MAIL",
            targetType: "MAIL",
            targetId: String(mail._id),
            targetName: mail.title,
            message: `${req.user?.username} sent mail "${mail.title}" to account ${mail.accountId}`,
            ip: req.ip,
            userAgent: req.get("user-agent") || undefined,
            metadata: {
                accountId: String(mail.accountId),
                rewards: mail.rewards,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Mail sent",
            data: mail,
        });
    } catch (error: any) {
        console.error("sendMailController error:", error);
        const status = error?.message === "Account not found" ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: error?.message || "Internal server error",
        });
    }
};

export const listMailsController = async (req: Request, res: Response) => {
    try {
        const parsed = listMailQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid query",
                errors: parsed.error.flatten(),
            });
        }

        const result = await listMailsAdmin(req.models.Mail, req.models.Account, parsed.data);
        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error: any) {
        console.error("listMailsController error:", error);
        const status = error?.message === "Account not found" ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: error?.message || "Internal server error",
        });
    }
};
