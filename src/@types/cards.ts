import { PaginationOptions } from "./common";

export interface SearchCardOptions extends PaginationOptions {
    name?: string;
    type?: string; // monster | spell | trap
    monsterType?: string;
    monsterAttribute?: string;
    level?: number;
    spellType?: string;
    trapType?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}


