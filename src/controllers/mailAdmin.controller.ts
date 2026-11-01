import { NextFunction, Request, Response } from "express";
import { listMailQuerySchema, recallMailParamsSchema, searchMailRecipientsSchema, sendMailSchema } from "../schemas/mailAdminSchema";
import { listMailsAdmin, recallMailAdmin, searchMailRecipients, sendMailAdmin } from "../services/mailAdmin.service";
import { ApiResponse } from "../utils/api-response";

export const searchMailRecipientsController = async (req: Request, res: Response, next: NextFunction) => {
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
        return ApiResponse.ok(res, "Mail recipients searched", data);
    } catch (error: any) {
        next(error);
    }
};

export const sendMailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = sendMailSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: parsed.error.issues[0]?.message || "Invalid request",
                errors: parsed.error.flatten(),
            });
        }

        const mails = await sendMailAdmin(req.models.Mail, req.models.Account, req.models.Card, {
            ...parsed.data,
            createdBy: req.user?.username,
        }, req.user, {
            ip: req.ip,
            userAgent: req.get("user-agent") || undefined,
        });

        return ApiResponse.created(res, "Mail sent", mails);
    } catch (error: any) {
        next(error);
    }
};

export const recallMailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = recallMailParamsSchema.safeParse(req.params);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid request",
                errors: parsed.error.flatten(),
            });
        }

        const mail = await recallMailAdmin(req.models.Mail, parsed.data.id, req.user, {
            ip: req.ip,
            userAgent: req.get("user-agent") || undefined,
        });

        return ApiResponse.ok(res, "Mail recalled", mail);
    } catch (error: any) {
        next(error);
    }
};

export const listMailsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = listMailQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid query",
                errors: parsed.error.flatten(),
            });
        }

        const result = await listMailsAdmin(req.models.Mail, req.models.Account, req.models.Card, parsed.data);
        return ApiResponse.ok(res, "Mails listed", result);
    } catch (error: any) {
        next(error);
    }
};
