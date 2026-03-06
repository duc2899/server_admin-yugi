import router from "express"
import accountRoute from "./accountRoute";
import cardRoute from "./cardRoute";
import tournamentRoute from "./tournamentRoute";
import authRoute from "./authRoute";

const initRoutes =  router.Router();

initRoutes.use("/accounts", accountRoute);
initRoutes.use("/cards", cardRoute);
initRoutes.use("/tournaments", tournamentRoute);
initRoutes.use("/auth", authRoute);

export default initRoutes;

