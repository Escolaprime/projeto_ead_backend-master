import { Router } from "express";
import authFactory from "../auth.factory";
const router = Router();

router.get("/", (req, res) => res.json({ ok: true }));
router.get("/loginAluno", (req, res) => authFactory.login_aluno(req, res));
router.get("/loginAdmin", (req, res) => authFactory.login(req, res));
router.get("/obterSessao", (req, res) => authFactory.carregar_sessao(req, res));
export default router;
