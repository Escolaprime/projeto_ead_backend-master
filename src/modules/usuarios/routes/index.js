import { Router } from "express";
import router from "./routes";

const usuariosRouter = Router();

usuariosRouter.use("/usuarios", router);

export default usuariosRouter;
