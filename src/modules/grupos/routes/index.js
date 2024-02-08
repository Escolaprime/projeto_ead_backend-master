import { Router } from "express";
import router from "./routes";

const gruposRouter = Router();

gruposRouter.use("/grupos", router);

export default gruposRouter;
