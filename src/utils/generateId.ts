import { Snowflake } from "@sapphire/snowflake";

const snowflake = new Snowflake(0); // machine id

export const generateLongId = (): String => {
    return snowflake.generate().toString(); // trả string
};