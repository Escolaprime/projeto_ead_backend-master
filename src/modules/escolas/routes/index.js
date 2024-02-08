import { Router } from "express";
import router from "./routes";

const escolasRouter = Router();

escolasRouter.use("/escolas", router);

export default escolasRouter;
