import { RelatorioController } from "./relatorio.controller";
import { RelatorioService } from "./relatorio.service";
import db from "@shared/database/knex";
const factory = () => {
  const service = new RelatorioService(db);
  const controller = new RelatorioController(service);
  return controller;
};

export default factory();
