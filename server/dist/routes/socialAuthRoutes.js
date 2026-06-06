import { Router } from "express";
import { generateAuthUrl, getSocialAccounts, syncAccounts, } from "../controllers/socialAuthController.js";
import { protect } from "../middlewares/authMiddleware.js";
const socialAuthRouter = Router();
socialAuthRouter.get("/accounts/sync", protect, syncAccounts);
socialAuthRouter.get("/accounts/:userId", protect, getSocialAccounts);
socialAuthRouter.get("/sync", protect, syncAccounts);
socialAuthRouter.get("/:platform", protect, generateAuthUrl);
export default socialAuthRouter;
