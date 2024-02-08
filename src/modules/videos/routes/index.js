import { Router } from "express";
import router from "./routes";

const videosRouter = Router();

videosRouter.use("/videos", router);

export default videosRouter;
