import { Router } from "express";
import router from "./routes";


const estatisticasRouter = Router();

estatisticasRouter.use("/stats", router)

export default estatisticasRouter