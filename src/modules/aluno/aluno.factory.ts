import { AlunoController } from "./aluno.controller";
import { AlunoService } from "./aluno.service";
import { AlunoKnexRepository } from "./repositiories/AlunoKnexRepository";
import db from "@shared/database/knex";
const factory = () => {
  const repository = new AlunoKnexRepository(db);
  const service = new AlunoService(repository);
  const controller = new AlunoController(service);
  return controller;
};

export default factory();
