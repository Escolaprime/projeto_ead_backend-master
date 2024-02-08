import { Router } from "express";
import etapaFactory from "../etapa.factory";

const router = Router();
router.get("/obterEtapa", (req, res) => etapaFactory.obter_etapa(req, res));
router.post("/inserirEtapa", (req, res) =>
  etapaFactory.inserir_etapa(req, res)
);
router.put("/atualizarEtapa", (req, res) =>
  etapaFactory.atualizar_etapa(req, res)
);
router.delete("/deletarEtapa", (req, res) =>
  etapaFactory.deletar_etapa(req, res)
);
export default router;
