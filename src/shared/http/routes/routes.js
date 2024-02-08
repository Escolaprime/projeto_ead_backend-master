import adminRouter from "@modules/admin/routes";
import alunosRouter from "@modules/aluno/routes";
import apkRouter from "@modules/apk/routes";
import authRouter from "@modules/auth/routes";
import escolasRouter from "@modules/escolas/routes";
import etapasRouter from "@modules/etapas/routes";
import gruposRouter from "@modules/grupos/routes";
import professoresRouter from "@modules/professores/routes";
import uploadRouter from "@modules/uploads/routes";
import usuariosRouter from "@modules/usuarios/routes";
import videosRouter from "@modules/videos/routes";
import estatisticasRouter from "@modules/estatisticas/routes";
import relatoriosRouter from "@modules/relatorios/routes";
export default [
  adminRouter,
  alunosRouter,
  apkRouter,
  authRouter,
  escolasRouter,
  etapasRouter,
  gruposRouter,
  professoresRouter,
  uploadRouter,
  usuariosRouter,
  videosRouter,
  estatisticasRouter,
  relatoriosRouter,
];
