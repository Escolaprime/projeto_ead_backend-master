import { verifyToken } from "@shared/providers/token";
import db from "@shared/database/knex";
import { AppError } from "@shared/errors/AppError";
import { compareHash } from "@shared/providers/hash";
export class AuthController {
  authService;
  relatorioService;
  constructor(authService, relatorioService) {
    this.authService = authService;
    this.relatorioService = relatorioService;
  }
  async login_aluno(req, res) {
    let { numero_matricula } = req.headers;

    numero_matricula = numero_matricula.replace(/^0+/, "");

    if (!numero_matricula) {
      return res.status(400).json({ mensagem: "Digite uma matricula válida" });
    }

    const [aluno] = await db
      .table("alunos")
      .select("id", "etapa_id", "escola_id", "numero_matricula")
      .where({ numero_matricula });

    if (!aluno) {
      return res.status(404).json({ mensagem: "Aluno não encontrado" });
    }

    const { id, etapa_id, escola_id } = aluno;
    await this.relatorioService.create({
      aluno_id: id,
      acessado_em: new Date(),
    });
    const token = this.authService.gerar_token_aluno(aluno);

    return res.json({
      id,
      etapa_id,
      escola_id,
      numero_matricula,
      token,
    });
  }
  async login(req, res) {
    const { email, password } = req.headers;

    if (!email || !password) {
      return res.status(400).json({ mensagem: "Requisição mal formatada" });
    }
    let result = null;
    try {
      result = await db
        .table("usuarios as user")
        .select(
          "user.id",
          "user.grupo_id",
          "gp.permissao_id",
          "user.senha",
          "user.hash",
          "user.nome"
        )
        .innerJoin("grupos as gp", "user.grupo_id", "=", "gp.id")
        .where({ email, ativo: true });
    } catch (error) {
      throw error;
    }

    if (!result.length) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
    const [user] = result;
    const { id, grupo_id, permissao_id, hash, senha, nome } = user;

    if (!(await compareHash(password, senha))) {
      return res
        .status(404)
        .json({ mensagem: "Usuário ou senha não correspondem" });
    }

    const token = this.authService.gerar_token_admin({
      id,
      grupo_id,
      permissao_id,
      nome,
    });

    return res.json({
      id,
      grupo_id,
      permissao_id,
      token,
    });
  }

  carregar_sessao(req, res, next) {
    const { authorization } = req.headers;

    const [_, token] = authorization.split(" ");

    if (!token) {
      return res.status(401).json({ mensagem: "Nenhum token fornecido" });
    }
    const decoded = verifyToken(token);
    if (!decoded) throw new AppError("Token expirado", 401);
    if (decoded) {
      const { id, grupo_id, permissao_id } = decoded;
      res.json({ id, grupo_id, permissao_id });
    }
  }
}
