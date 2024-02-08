import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RelatorioService } from "@modules/relatorios/relatorio.service";
import db from "@shared/database/knex";
const factory = () => {
  const relatorioService = new RelatorioService(db);
  const service = new AuthService();
  const controller = new AuthController(service, relatorioService);
  return controller;
};

export default factory();
