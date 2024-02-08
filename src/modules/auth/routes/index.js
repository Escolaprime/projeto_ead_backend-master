import { Router } from "express";
import router from "./routes";

const authRouter = Router();

authRouter.use("/autenticacao", router);

export default authRouter;
