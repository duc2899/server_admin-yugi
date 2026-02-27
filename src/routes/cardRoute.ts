import router from "express";
import { fetchAllCards, searchCardsController } from "../controllers/cardController";

const cardRoute = router.Router();
cardRoute.get("/", fetchAllCards);
cardRoute.get("/search", searchCardsController);

export default cardRoute;