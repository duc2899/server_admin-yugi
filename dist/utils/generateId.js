"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLongId = void 0;
const snowflake_1 = require("@sapphire/snowflake");
const snowflake = new snowflake_1.Snowflake(0); // machine id
const generateLongId = () => {
    return snowflake.generate().toString(); // trả string
};
exports.generateLongId = generateLongId;
