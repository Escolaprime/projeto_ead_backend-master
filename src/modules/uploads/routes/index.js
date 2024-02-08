import { Router } from "express";
import router from "./routes";

const uploadRouter = Router();

uploadRouter.use("/upload", router);

export default uploadRouter;
