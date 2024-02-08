import { Router } from "express";
import router from "./routes";

const professoresRouter = Router();

professoresRouter.use("/professores", router);

export default professoresRouter;
