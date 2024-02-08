import { Router } from "express";
import relatorioFactory from "../relatorio.factory";
const router = Router();

router.get("/downloads", (req, res) =>
  relatorioFactory.downloadRelatorios(req, res)
);
export default router;
