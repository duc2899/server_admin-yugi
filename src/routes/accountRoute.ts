import router from "express";
import { fetchAllAccounts } from "../controllers/accountController";

const accountRoute = router.Router();
accountRoute.get("/", fetchAllAccounts);

export default accountRoute;