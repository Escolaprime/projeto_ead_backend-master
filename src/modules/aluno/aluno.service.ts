import { createReadStream } from "fs";
import { Readable } from "stream";
import { AlunoKnexRepository } from "./repositiories/AlunoKnexRepository";
import csv from "csvtojson/v2";
import logger from "@shared/utils/logger";
export class AlunoService {
  constructor(private readonly alunoRepository: AlunoKnexRepository) {}

  async create(data: any) {
    return await this.alunoRepository.create(data);
  }

  async findAll() {
    return await this.alunoRepository.findAll();
  }

  async createManyViaCSV(file: Buffer) {
    const stream = Readable.from(file);
    const alunos = await csv({
      checkType: true,
      ignoreEmpty: true,
      trim: true,
    }).fromStream(stream);
    const mapped = alunos.map((aluno) => ({
      primeiro_nome: aluno.nome,
      escola_id: aluno.escola,
      etapa_id: aluno.etapa,
      numero_matricula: String(aluno.matricula),
    }));
    let erros = [];
    for (const aluno of mapped) {
      try {
        await this.create(aluno);
      } catch (error) {
        erros.push({
          aluno,
          error: error.message.includes("duplicate") && "Matricula duplicada",
        });
        logger.error(error.message);
        continue;
      }
    }
    return erros;
  }
}
