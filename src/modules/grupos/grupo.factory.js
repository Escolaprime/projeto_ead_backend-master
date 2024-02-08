import { GrupoController } from "./grupo.controller";
import { GrupoService } from "./grupo.service";

const factory = () => {
  const service = new GrupoService();
  const controller = new GrupoController(service);
  return controller;
};

export default factory();
