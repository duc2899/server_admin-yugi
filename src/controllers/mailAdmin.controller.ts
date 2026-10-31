import { Request, Response } from "express";
import { listMailQuerySchema, searchMailRecipientsSchema, sendMailSchema } from "../schemas/mailAdminSchema";
import { listMailsAdmin, searchMailRecipients, sendMailAdmin } from "../services/mailAdmin.service";
import { createActivityLogService } from "../services/activityLog.service";

export const searchMailRecipientsController = async (req: Request, res: Response) => {
    try {
        const parsed = searchMailRecipientsSchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid query",
                errors: parsed.error.flatten(),
            });
        }

        const data = await searchMailRecipients(
            req.models.Account,
            parsed.data.q,
            parsed.data.limit
        );
        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error: any) {
        console.error("searchMailRecipientsController error:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal server error",
        });
    }
};

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

        const mails = await sendMailAdmin(req.models.Mail, req.models.Account, {
            ...parsed.data,
            createdBy: req.user?.username,
        });
        const accountIds = mails.map((mail) => String(mail.accountId));

        await createActivityLogService({
            userId: String(req.user?._id ?? ""),
            username: req.user?.username,
            action: "SEND_MAIL",
            targetType: "MAIL",
            targetId: String(mails[0]?._id ?? ""),
            targetName: mails[0]?.title,
            message: `${req.user?.username} sent mail "${mails[0]?.title}" to ${mails.length} account(s)`,
            ip: req.ip,
            userAgent: req.get("user-agent") || undefined,
            metadata: {
                accountIds,
                mailIds: mails.map((mail) => String(mail._id)),
                rewards: mails[0]?.rewards,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Mail sent",
            data: mails,
        });
    } catch (error: any) {
        console.error("sendMailController error:", error);
        const status = String(error?.message || "").startsWith("Account not found") ? 404 : 500;
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
