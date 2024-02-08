import { Router } from "express";
import routes from "./routes";

const router = Router();

router.use("/relatorios", routes);

export default router;
