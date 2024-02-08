import { Router } from "express";
import usuarioFactory from "../usuario.factory";

const router = Router();

router.get("/obterUsuario", (req, res) =>
  usuarioFactory.obter_usuario(req, res)
);
router.post("/inserirUsuario", (req, res) => {
  return usuarioFactory.inserir_usuario(req, res);
});
router.put("/atualizarUsuario", (req, res) =>
  usuarioFactory.atualizar_usuario(req, res)
);
router.delete("/deletarUsuario/:usuarioId/:nome", (req, res) =>
  usuarioFactory.deletar_usuario(req, res)
);
router.post("/listarUsuarios", (req, res) =>
  usuarioFactory.listar_usuarios(req, res)
);
router.post("/atualizaSenhaUsr", (req, res) =>
  usuarioFactory.atualiza_senha_usr(req, res)
);
router.post("/atualizaEmailUsr", (req, res) =>
  usuarioFactory.atualiza_email_usr(req, res)
);
export default router;
