import db from "@shared/database/knex";

export class EtapaController {
  etapaService;
  constructor(etapaService) {
    this.etapaService = etapaService;
  }

  async obter_etapa(req, res) {
    const { etapa_id: id } = req.query;

    try {
      const etapas = await db
        .table("etapas")
        .select("id AS etapa_id", "escola_id", "titulo")
        .where({ id })
        .orderBy("titulo", "asc");
      return res.json(etapas);
    } catch (error) {
      throw error;
    }
  }
  async inserir_etapa(req, res) {
    const { titulo, descricao, escola_id } = req.body;

    try {
      await db.table("etapas").insert({
        titulo,
        descricao,
        escola_id,
      });
      return res.json({ mensagem: "Etapa inserida com sucesso" });
    } catch (error) {
      throw error;
    }
  }

  async atualizar_etapa(req, res) {
    /**
     * ? A etapa vai ser atualizada ?
     */
  }

  async deletar_etapa(req, res) {
    const { id } = req.query;

    try {
      await db.table("etapas").del().where({ id });
    } catch (error) {
      throw error;
    }
  }
}
