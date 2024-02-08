import { Router } from "express";
import adminFactory from "../admin.factory";
import upload from "@shared/providers/upload/upload";
const router = Router();

router.get("/", adminFactory.validate);

router.get("/obterEscolas", (req, res) => adminFactory.obter_escolas(req, res));
router.get("/editarEscola", (req, res) => adminFactory.editar_escola(req, res));

router.get("/obterAlunos", (req, res) => adminFactory.obter_alunos(req, res));
router.put("/editarAluno", (req, res) => adminFactory.editar_aluno(req, res));
router.delete("/excluirAlunos/:escolaId/:nomeEscola", (req, res) =>
  adminFactory.excluirAlunos(req, res)
);

router.post("/obterVideos", (req, res) => adminFactory.obter_videos(req, res));
router
  .use(upload.single("video"))
  .post("/editarVideo", (req, res) => adminFactory.editar_video(req, res));

router.get("/streaming/:time", (req, res) =>
  adminFactory.streaming_video(req, res)
);

router.put("/editarInformacoesVideo", (req, res) =>
  adminFactory.editar_informacoes_video(req, res)
);

router.get("/obterProfessores", (req, res) =>
  adminFactory.obter_professores(req, res)
);
router.put("/editarProfessor", (req, res) =>
  adminFactory.editar_professor(req, res)
);
router.get("/obterEtapa", (req, res) => adminFactory.obter_etapa(req, res));
router.put("/editarEtapa", (req, res) => adminFactory.editar_etapa(req, res));

router.post("/criarSemana", (req, res) => adminFactory.criarSemana(req, res));
router.get("/obterSemanas", (req, res) => adminFactory.obter_semanas(req, res));
router.put("/editarSemana", (req, res) => adminFactory.editarSemana(req, res));

router.get("/obterDias", (req, res) => adminFactory.obter_dias(req, res));
export default router;
