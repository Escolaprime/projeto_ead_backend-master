import { Router } from "express";
import grupoFactory from "../grupo.factory";

const router = Router();

router.get("/obterGrupo", (req, res) => grupoFactory.obter_grupo(req, res));
router.get("/obterGrupos", (req, res) => grupoFactory.obter_grupos(req, res));
router.post("/inserirGrupo", (req, res) =>
  grupoFactory.inserir_grupo(req, res)
);
router.put("/atualizarGrupo", (req, res) =>
  grupoFactory.atualizar_grupo(req, res)
);
router.delete("/deletarGrupo", (req, res) =>
  grupoFactory.deletar_grupo(req, res)
);
export default router;
