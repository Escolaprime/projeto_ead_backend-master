import { Router } from "express";
import apkFactory from "../apk.factory";

const router = Router();
router.get("/obterVersaoApk", (req, res) =>
  apkFactory.obter_versao_apk(req, res)
);

export default router;
