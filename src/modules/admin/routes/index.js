import { Router } from "express";
import router from "./routes";

const adminRouter = Router();

adminRouter.use("/admin", router);

export default adminRouter;
