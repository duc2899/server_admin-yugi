import router from "express"
import accountRoute from "./accountRoute";
import cardRoute from "./cardRoute";
import tournamentRoute from "./tournamentRoute";
import authRoute from "./authRoute";
import adminRoute from "./adminRoute"

const initRoutes = router.Router();

initRoutes.use("/accounts", accountRoute);
initRoutes.use("/cards", cardRoute);
initRoutes.use("/tournaments", tournamentRoute);
initRoutes.use("/auth", authRoute);
initRoutes.use("/admin", adminRoute)

export default initRoutes;

