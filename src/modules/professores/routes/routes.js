import { Router } from "express";
import professorFactory from "../professor.factory";

const router = Router();
router.get("/obterProfessor", (req, res) =>
  professorFactory.obter_professor(req, res)
);
router.post("/inserirProfessor", (req, res) =>
  professorFactory.inserir_professor(req, res)
);
router.put("/atualizarProfessor", (req, res) =>
  professorFactory.atualizar_professor(req, res)
);
router.delete("/:professorId", (req, res) =>
  professorFactory.deletar_professor(req, res)
);
export default router;
