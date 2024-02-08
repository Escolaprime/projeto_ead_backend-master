import { Router } from "express";
import alunoFactory from "../aluno.factory";
import multer, { memoryStorage } from "multer";
const uploader = multer({
  storage: memoryStorage(),
});
const router = Router();

router.get("/", (req, res) => alunoFactory.findAll(req, res));
router.get("/obterAluno", (req, res) => alunoFactory.obter_aluno(req, res));
router.get("/obterPerfil", (req, res) => alunoFactory.obter_perfil(req, res));
router.post("/inserirAluno", (req, res) =>
  alunoFactory.inserir_aluno(req, res)
);
router.put("/atualizarAluno", (req, res) =>
  alunoFactory.atualizar_aluno(req, res)
);
router.delete("/deletarAluno", (req, res) =>
  alunoFactory.deletar_aluno(req, res)
);
router.get("/obter_params_app", (req, res) =>
  alunoFactory.obter_params_app(req, res)
);

router.get("/obterSemanas", (req, res) => alunoFactory.obter_semanas(req, res));
router.get("/obterDias", (req, res) => alunoFactory.obter_dias(req, res));

router
  .use(uploader.single("csv"))
  .post("/csv/upload", (req, res) => alunoFactory.createAlunosViaCSV(req, res));
export default router;
