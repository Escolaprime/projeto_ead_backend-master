import db from "@shared/database/knex";
import { AppError } from "@shared/errors/AppError";

export class ProfessorController {
  professorService;
  constructor(professorService) {
    this.professorService = professorService;
  }

  async obter_professor(req, res) {
    const { id, usuario_id } = req.query;

    try {
      var professor = await db
        .table("professores")
        .select("id", "primeiro_nome")
        .where("ativo", "=", true);
    } catch (error) {
      return res.status(500).send({ err: error.toString() });
    }
    return res.send(professor);
  }

  async inserir_professor(req, res) {
    let { primeiro_nome, segundo_nome, escola_id } = req.body;

    try {
      await db.table("professores").insert({
        primeiro_nome,
        segundo_nome,
        escola_id,
      });
    } catch (error) {
      console.log(error.toString());
      return res.status(500).send({ err: error.toString() });
    }

    return res.send({ mensagem: "Professor inserido com sucesso" });
  }

  async atualizar_professor(req, res) {
    /**
     * ? O professor vai ser atualizado ?
     */
  }

  async deletar_professor(req, res) {
    const professorIdDisabled = 31;
    const id = req.params.professorId;
    const user = req.user;
    if (![7].includes(user.grupo_id))
      throw new AppError("Você não tem permissão para esta ação", 403);
    try {
      await db
        .table("videos")
        .update({
          professor_id: professorIdDisabled,
        })
        .where({ professor_id: id });
      await db.table("professores").del().where({ id });
    } catch (error) {
      return res.status(500).send({ err: error.toString() });
    }

    return res.send({ mensagem: "Professor deletado com sucesso" });
  }
}
