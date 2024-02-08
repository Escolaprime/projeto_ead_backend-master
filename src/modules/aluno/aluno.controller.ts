import db from "@shared/database/knex";
import { Request, Response } from "express";
import { AlunoService } from "./aluno.service";
import { AppError } from "@shared/errors/AppError";
export class AlunoController {
  constructor(private alunoService: AlunoService) {}
  async create(req: Request, res: Response) {
    const { body } = req;
    const response = await this.alunoService.create(body);

    return res.json(response);
  }

  async findAll(req: Request, res: Response) {
    const response = await this.alunoService.findAll();
    return res.json(response);
  }
  async obter_params_app(req, res) {
    const CRC = req.query.CRC;

    if (CRC && CRC != 9) {
      return res.status(401).json();
    }

    try {
      const PARAMS = await db
        .table("parametros")
        .select("parametro AS NUN_SUPORTE_WHATSAPP")
        .where("classe_param", "NUM_CONTATO_APP_WHATSAPP");
      return res.json({ codigo: 0, dados: PARAMS[0], menssagem: "" });
    } catch (error) {
      return res.status(500).json();
    }
  }

  async obter_aluno(req, res) {
    const { id, etapa_id, usuario_id, primeiro_nome, segundo_nome, idade } =
      req.query;

    try {
      const aluno = await db
        .table("alunos")
        .select("*")
        .where({ id, usuario_id });
      return res.json(aluno);
    } catch (error) {
      throw error;
    }
  }

  async obter_perfil(req, res) {
    const { id } = req.query;

    try {
      const perfil = await db
        .table("alunos AS al")
        .select(
          "al.primeiro_nome",
          "al.segundo_nome",
          "al.numero_matricula",
          "es.nome_escola",
          "et.titulo"
        )
        .join("escolas AS es", "al.escola_id", "=", "es.id")
        .join("etapas AS et", "al.etapa_id", "=", "et.id")
        .where("al.id", "=", id);
      return res.json(perfil);
    } catch (error) {
      throw error;
    }
  }

  async inserir_aluno(req, res) {
    const {
      primeiro_nome,
      segundo_nome,
      escola_id,
      etapa_id,
      numero_matricula,
    } = req.body;

    try {
      await db.table("alunos").insert({
        primeiro_nome,
        segundo_nome,
        escola_id,
        etapa_id,
        numero_matricula,
      });
      return res.json({ mensagem: "Aluno inserido com sucesso" });
    } catch (error) {
      throw error;
    }
  }

  async atualizar_aluno(req, res) {
    /**
     * ? Haverá atualização de alunos ?
     * ? O que será atualizado ?
     */
  }

  async deletar_aluno(req, res) {
    const { id, usuario_id } = req.query;

    try {
      await db.table("alunos").del().where({ id, usuario_id });
      return res.json({ mensagem: "Aluno deletado com sucesso" });
    } catch (error) {
      throw error;
    }
  }

  async obter_semanas(req, res) {
    try {
      const rows = await db
        .table("semanas")
        .select("*")
        .where("ativo", true)
        .orderBy("id", "asc")
        .whereNot("id", 20); // Id 20 foi para dev

      return res.json(rows);
    } catch (error) {
      throw error;
    }
  }

  async obter_dias(req, res) {
    try {
      const rows = await db
        .table("dias")
        .select("*")
        .whereNot("id", 8)
        .orderBy("id", "asc");

      return res.json(rows);
    } catch (error) {
      throw error;
    }
  }

  async createAlunosViaCSV(req: Request, res: Response) {
    const file = req.file;
    // @ts-ignore
    const user = req.user;
    if (![7].includes(user.grupo_id))
      throw new AppError("Você não tem permissão para fazer esta ação", 403);
    if (!file)
      throw new AppError(
        "Você precisa enviar um arquivo com a extensão .csv",
        400
      );
    const { buffer } = file;
    const response = await this.alunoService.createManyViaCSV(buffer);

    return res.json({
      mensagem: `Alunos inseridos com ${response.length} erros`,
      erros: response,
    });
  }
}
