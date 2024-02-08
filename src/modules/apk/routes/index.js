import { Router } from "express";
import router from "./routes";

const apkRouter = Router();

apkRouter.use("/apk", router);

export default apkRouter;
