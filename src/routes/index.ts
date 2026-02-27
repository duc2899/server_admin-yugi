import router from "express"
import accountRoute from "./accountRoute";
import cardRoute from "./cardRoute";

const initRoutes =  router.Router();

initRoutes.use("/accounts", accountRoute);
initRoutes.use("/cards", cardRoute);

export default initRoutes;

