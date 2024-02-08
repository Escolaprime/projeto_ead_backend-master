import { Router } from "express";
import escolaFactory from "../escola.factory";

const router = Router();
router.get("/obterEscola", (req, res) => escolaFactory.obter_escola(req, res));
router.post("/inserirEscola", (req, res) =>
  escolaFactory.inserir_escola(req, res)
);
router.put("/atualizarEscola", (req, res) =>
  escolaFactory.atualizar_escola(req, res)
);
router.delete("/deletarEscola", (req, res) =>
  escolaFactory.deletar_escola(req, res)
);
export default router;
