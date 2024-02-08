import { Router } from "express";
import router from "./routes";

const alunosRouter = Router();

alunosRouter.use("/alunos", router);

export default alunosRouter;
