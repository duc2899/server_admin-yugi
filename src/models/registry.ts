// models/registry.ts
import { Connection } from "mongoose";
import { Card } from "./card";
import { Account } from "./account";
import { Tournament } from "./tournament";
import { DeckAdmin } from "./deckAdmin";
import { Deck } from "./deck";
import { Config } from "./config";

export const getModelsForConnection = (connection: Connection) => ({
    Card: Card(connection),
    Account: Account(connection),
    Tournament: Tournament(connection),
    DeckAdmin: DeckAdmin(connection),
    Deck: Deck(connection),
    Config: Config(connection),
});

// Suy type từ chính hàm trên — không cần viết tay
export type DataModels = ReturnType<typeof getModelsForConnection>;