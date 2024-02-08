import { EtapaController } from "./etapa.controller";
import { EtapaService } from "./etapa.service";

const factory = () => {
  const service = new EtapaService();
  const controller = new EtapaController(service);
  return controller;
};

export default factory();
