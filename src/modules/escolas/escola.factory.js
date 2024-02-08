import { EscolaController } from "./escola.controller";
import { EscolaService } from "./escola.service";

const factory = () => {
  const service = new EscolaService();
  const controller = new EscolaController(service);
  return controller;
};

export default factory();
