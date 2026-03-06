import { PaginationOptions } from "./common";

export interface GetTournamentOptions extends PaginationOptions {
    name?: string;
    type?: string;
    status?: string;
}