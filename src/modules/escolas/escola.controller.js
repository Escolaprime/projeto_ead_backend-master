import db from "@shared/database/knex";
import { AppError } from "@shared/errors/AppError";
export class EscolaController {
  escolaService;
  constructor(escolaService) {
    this.escolaService = escolaService;
  }

  async obter_escola(req, res) {
    const { id } = req.query;

    try {
      const escolas = await db.table("escolas").select("*");
      return res.json(escolas);
    } catch (error) {
      throw error;
    }
  }

  async inserir_escola(req, res) {
    const { nome_escola } = req.body;
    if (![7].includes(user.grupo_id))
      throw new AppError("Você não tem permissão para fazer esta ação", 403);
    try {
      await db.table("escolas").insert({
        nome_escola,
      });
      return res.json({ mensagem: "Escola inserida com sucesso" });
    } catch (error) {
      throw error;
    }
  }

  async atualizar_escola(req, res) {
    /**
     * ? O que será atualizado ?
     */
  }

  async deletar_escola(req, res) {
    const { id } = req.query;

    try {
      await db.table("escolas").del().where({ id });
      return res.json({ mensagem: "Escola deletada com sucesso" });
    } catch (error) {
      throw error;
    }
  }
}
