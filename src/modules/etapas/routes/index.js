import { Router } from "express";
import router from "./routes";

const etapasRouter = Router();

etapasRouter.use("/etapas", router);

export default etapasRouter;
