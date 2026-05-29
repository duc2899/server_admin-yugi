"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceljs_1 = __importDefault(require("exceljs"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../configs/db");
const card_1 = __importDefault(require("../models/card"));
const exportCardsToExcel = async () => {
    try {
        console.log("Connecting DB...");
        await (0, db_1.connectDB)();
        console.log("DB connected!");
        const workbook = new exceljs_1.default.Workbook();
        workbook.creator = "Yugi Export Tool";
        workbook.created = new Date();
        const worksheet = workbook.addWorksheet("Cards", {
            views: [{ state: "frozen", ySplit: 1 }], // freeze header
        });
        worksheet.columns = [
            { header: "_id", key: "_id", width: 28 },
            { header: "name", key: "name", width: 30 },
            { header: "code", key: "code", width: 15 },
            { header: "type", key: "type", width: 18 },
            { header: "level", key: "level", width: 8 },
            { header: "atk", key: "atk", width: 8 },
            { header: "def", key: "def", width: 8 },
            { header: "trapType", key: "trapType", width: 15 },
            { header: "spellType", key: "spellType", width: 15 },
            { header: "monsterType", key: "monsterType", width: 20 },
            { header: "monsterAttribute", key: "monsterAttribute", width: 18 },
            { header: "monsterCategories", key: "monsterCategories", width: 35 },
            { header: "desc", key: "desc", width: 60 },
            { header: "descVN", key: "descVN", width: 60 },
            { header: "imageUrl", key: "imageUrl", width: 40 },
            { header: "sourceImageUrl", key: "sourceImageUrl", width: 40 },
            { header: "sourceThumbImage", key: "sourceThumbImage", width: 40 },
            { header: "sourceUrl", key: "sourceUrl", width: 40 },
            { header: "originCode", key: "originCode", width: 15 },
            { header: "cardLimitStatus", key: "cardLimitStatus", width: 18 },
            { header: "activeStatus", key: "activeStatus", width: 15 },
            { header: "createdTime", key: "createdTime", width: 22 },
            { header: "updatedTime", key: "updatedTime", width: 22 },
        ];
        // Header style
        const headerRow = worksheet.getRow(1);
        headerRow.height = 22;
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF1E3A8A" }, // xanh đậm
            };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });
        // Auto filter
        worksheet.autoFilter = {
            from: "A1",
            to: "W1",
        };
        console.log("Fetching cards...");
        const cursor = card_1.default.find().lean().cursor();
        let count = 0;
        for await (const card of cursor) {
            const row = worksheet.addRow({
                _id: card._id?.toString(),
                name: card.name,
                code: card.code,
                type: card.type,
                level: card.level,
                atk: card.atk,
                def: card.def,
                trapType: card.trapType,
                spellType: card.spellType,
                monsterType: card.monsterType,
                monsterAttribute: card.monsterAttribute,
                monsterCategories: Array.isArray(card.monsterCategories)
                    ? card.monsterCategories.join(", ")
                    : "",
                desc: card.desc,
                descVN: card.descVN,
                imageUrl: card.imageUrl,
                sourceImageUrl: card.sourceImageUrl,
                sourceThumbImage: card.sourceThumbImage,
                sourceUrl: card.sourceUrl,
                originCode: card.originCode,
                cardLimitStatus: card.cardLimitStatus,
                activeStatus: card.activeStatus,
                createdTime: card.createdTime,
                updatedTime: card.updatedTime,
            });
            row.height = 60;
            // Zebra row (xen kẽ)
            const isEvenRow = row.number % 2 === 0;
            row.eachCell((cell, colNumber) => {
                cell.alignment = {
                    vertical: "top",
                    horizontal: colNumber >= 5 && colNumber <= 7 ? "center" : "left",
                    wrapText: true,
                };
                cell.border = {
                    top: { style: "thin", color: { argb: "FFDDDDDD" } },
                    left: { style: "thin", color: { argb: "FFDDDDDD" } },
                    bottom: { style: "thin", color: { argb: "FFDDDDDD" } },
                    right: { style: "thin", color: { argb: "FFDDDDDD" } },
                };
                if (isEvenRow) {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFF3F4F6" }, // xám nhạt
                    };
                }
            });
            // Format date columns (createdTime, updatedTime)
            const createdCell = row.getCell("createdTime");
            const updatedCell = row.getCell("updatedTime");
            createdCell.numFmt = "yyyy-mm-dd hh:mm:ss";
            updatedCell.numFmt = "yyyy-mm-dd hh:mm:ss";
            count++;
            if (count % 500 === 0) {
                console.log(`Exported ${count} cards...`);
            }
        }
        // Set row height tự động cho desc/descVN
        worksheet.getColumn("desc").alignment = { wrapText: true, vertical: "top" };
        worksheet.getColumn("descVN").alignment = { wrapText: true, vertical: "top" };
        // Wrap luôn cho monsterCategories
        worksheet.getColumn("monsterCategories").alignment = {
            wrapText: true,
            vertical: "top",
        };
        // Center cho level atk def
        ["level", "atk", "def"].forEach((key) => {
            worksheet.getColumn(key).alignment = {
                horizontal: "center",
                vertical: "middle",
            };
        });
        const fileName = `cards_export_${Date.now()}.xlsx`;
        console.log("Writing file...");
        await workbook.xlsx.writeFile(fileName);
        console.log(`DONE: Exported ${count} cards -> ${fileName}`);
        await mongoose_1.default.disconnect();
        console.log("Disconnected DB!");
    }
    catch (error) {
        console.log("Export failed:", error);
        process.exit(1);
    }
};
exportCardsToExcel();
