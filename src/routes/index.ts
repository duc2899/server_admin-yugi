import router from "express"
import accountRoute from "./account.route";
import cardRoute from "./card.route";
import tournamentRoute from "./tournament.route";
import authRoute from "./auth.route";
import adminRoute from "./admin.route"
import healthRoute from "./health.route"

const initRoutes = router.Router();

initRoutes.use("/accounts", accountRoute);
initRoutes.use("/cards", cardRoute);
initRoutes.use("/tournaments", tournamentRoute);
initRoutes.use("/auth", authRoute);
initRoutes.use("/admin", adminRoute)
initRoutes.use("/health", healthRoute)

export default initRoutes;

