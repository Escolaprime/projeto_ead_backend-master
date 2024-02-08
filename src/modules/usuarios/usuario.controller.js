import { generateHash } from "@shared/providers/hash";
import db from "@shared/database/knex";
import { loggerAudit } from "@shared/providers/logger";
import { AppError } from "@shared/errors/AppError";
import logger from "@shared/utils/logger";

export class UsuarioController {
  usuarioService;
  constructor(usuarioService) {
    this.usuarioService = usuarioService;
  }

  async obter_usuario(req, res) {
    const { id, hash } = req.query;

    try {
      var user = await db.table("usuarios").select("*").where({ id, hash });
    } catch (error) {
      throw error;
    }

    return res.json(user);
  }

  async inserir_usuario(req, res) {
    const { CRC, dados } = req.body.params;

    if (CRC != 9) return res.status(500).json();

    const { nome, grupo_id, email, senha, ativo } = dados;

    // CHECA SE O EMAIL JÁ EXISTE
    const email_valido = await this.usuarioService.CHECA_EMAIL_USUARIO(email);

    if (email_valido != 0) {
      return res.json({
        codigo: 1,
        dados: "",
        mensagem: "INFO:: Email já cadastrado !",
      });
    } // FIM CHECA SE O EMAIL JÁ EXISTE

    const timestamp = new Date().getTime().toString();
    const hash = await generateHash(timestamp, 5);

    const password = await generateHash(senha);

    try {
      await db.table("usuarios").insert({
        nome,
        grupo_id,
        email,
        senha: password,
        hash,
        ativo,
      });
    } catch (error) {
      throw error;
    }

    return res.json({
      codigo: 0,
      dados: "",
      mensagem: "Usuário inserido com sucesso",
    });
  }

  async atualiza_senha_usr(req, res) {
    try {
      const CRC = req.body.params.CRC;
      if (CRC != 9) return res.status(401).json();
    } catch (error) {
      if (CRC != 9) return res.status(401).json();
    }
    const dados = req.body.params.dados;
    const { id, senha } = dados;

    // ENCRIPITA SENHA
    const timestamp = new Date().getTime().toString();
    const SENHA = await generateHash(senha);

    try {
      await db.table("usuarios").update("senha", SENHA).where("id", id);
    } catch (error) {
      console.log(error);
      return res.json({ codigo: 1, dados: "", mensagem: error });
    }

    return res.json({
      codigo: 0,
      dados: "",
      mensagem: "INFO:: Senha do Usuário editado com sucesso !",
    });
  }

  async atualiza_email_usr(req, res) {
    try {
      const CRC = req.body.params.CRC;
      if (CRC != 9) return res.status(401).json();
    } catch (error) {
      if (CRC != 9) return res.status(401).json();
    }
    const dados = req.body.params.dados;
    const { id, email } = dados;

    const email_valido = await this.usuarioService.CHECA_EMAIL_USUARIO(email);

    if (email_valido == 1) {
      return res.json({
        codigo: 1,
        dados: "",
        mensagem: "INFO:: Email já cadastrado !",
      });
    }

    try {
      await db.table("usuarios").update("email", email).where("id", id);
    } catch (error) {
      console.log(error);
      return res.json({ codigo: 1, dados: "", mensagem: error });
    }

    return res.json({
      codigo: 0,
      dados: "",
      mensagem: "INFO:: Email do Usuário editado com sucesso !",
    });
  }

  async atualizar_usuario(req, res) {
    try {
      const CRC = req.body.params.CRC;
      if (CRC != 9) return res.status(401).json();
    } catch (error) {
      if (CRC != 9) return res.status(401).json();
    }

    const dados = req.body.params.dados;
    const { id, nome, criado_em, ativo, grupo_id } = dados;

    var UPDATE = {
      nome: nome,
      criado_em: criado_em,
      ativo: ativo,
      grupo_id: grupo_id,
    };

    try {
      await db.table("usuarios").update(UPDATE).where("id", id);
    } catch (error) {
      console.log(error);
      return res.json({ codigo: 1, dados: "", mensagem: error });
    }

    return res.json({
      codigo: 0,
      dados: "",
      mensagem: "INFO:: Usuário editado com sucesso !",
    });
  }

  async deletar_usuario(req, res) {
    const { usuarioId, nome } = req.params;
    const user = req.user;
    if (![7].includes(user.grupo_id))
      throw new AppError("Você não tem permissão para fazer esta ação", 403);
    try {
      await db
        .table("usuarios")
        .del()
        .where({ id: Number(usuarioId) });
      loggerAudit.log(
        `${user.nome} deletou o usuário ${usuarioId} ${nome}`,
        "DELETE"
      );
      return res.json({ mensagem: "Usuario deletado com sucesso" });
    } catch (error) {
      logger.error(error);
      throw new AppError("Error interno", 500);
    }
  }

  async listar_usuarios(req, res) {
    try {
      const CRC = req.body.params.CRC;
      if (CRC != 9) return res.status(401).json();
    } catch (error) {
      if (CRC != 9) return res.status(401).json();
    }
    const psqUsuario_tx = req.body.params.c;

    try {
      var usuarios = await db
        .table("usuarios AS us")
        .select(
          "us.id",
          "us.email",
          "us.nome",
          "us.criado_em",
          "us.ativo",
          "us.grupo_id",
          "grp.nome_grupo",
          "grp.descricao AS grupo_descricao"
        )
        .join("grupos AS grp", "us.grupo_id", "grp.id")
        .where("us.nome", "ilike", `%${psqUsuario_tx}%`)
        .andWhere("us.id", "!=", "3")
        .orWhere("us.email", "ilike", `%${psqUsuario_tx}%`);
    } catch (e) {
      return res.json({ codigo: 1, dados: "", mensagem: error });
    }

    if (usuarios.length > 0) {
      return res.json({ codigo: 0, dados: usuarios, mensagem: "" });
    } else {
      return res.json({
        codigo: -1,
        dados: "",
        mensagem: "Nenhum usuário encontrado.",
      });
    }
  }
}
