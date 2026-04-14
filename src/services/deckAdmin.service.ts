import DeckAdmin from "../models/deckAdmin";
import { CreateDeckAdminPayload } from "../types/deckAdmin";
import { generateLongId } from "../utils/generateId";

const createDeckAdminService = async (payload: CreateDeckAdminPayload) => {
    try {
        const { name, type = "DEFAULT", mainDeckCards, sideDeckCards, extraDeckCards } = payload;

        const newDeckAdmin = new DeckAdmin({
            _id: generateLongId(),
            name,
            type,
            mainDeckCards,
            sideDeckCards,
            extraDeckCards,
        });
        await newDeckAdmin.save();
        return {
            ...newDeckAdmin.toObject(),
            _id: newDeckAdmin._id.toString(), // trả string cho client
        };

    } catch (error) {
        throw error;
    }
};

export { createDeckAdminService }

