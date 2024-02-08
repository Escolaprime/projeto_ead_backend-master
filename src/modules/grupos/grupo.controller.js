import db from "@shared/database/knex";

export class GrupoController {
  grupoService;
  constructor(grupoService) {
    this.grupoService = grupoService;
  }

  async obter_grupo(req, res, next) {
    const { id } = req.query;

    try {
      const grupos = await db.table("grupos").select("*").where({ id });

      return res.json(grupos);
    } catch (error) {
      return next({
        classe: "SQL INJECTION",
        error,
      });
    }
  }

  async obter_grupos(req, res) {
    try {
      const CRC = req.query.CRC;
      if (CRC != 9) return res.status(401).json();
    } catch (error) {
      if (CRC != 9) return res.status(401).json();
    }

    try {
      const grupos = await db.table("grupos").select("*");
      return res.json(grupos);
    } catch (error) {
      throw error;
    }
  }

  async inserir_grupo(req, res) {
    const { nome_grupo, descricao } = req.body;

    try {
      await db.table("grupos").insert({
        nome_grupo: nome_grupo.toUpperCase(),
        descricao,
      });
    } catch (error) {
      throw error;
    }

    return res.json({ mensagem: "Grupo inserido com sucesso" });
  }

  async atualizar_grupo(req, res) {
    /**
     * ? O grupo será atualizado ?
     */
  }

  async deletar_grupo(req, res) {
    const { id } = req.query;

    try {
      await db.table("grupos").del().where({ id });
    } catch (error) {
      throw error;
    }

    return res.json({ mensagem: "Grupo deletado com sucesso" });
  }
}
