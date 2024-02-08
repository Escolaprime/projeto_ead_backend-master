import { UsuarioController } from "./usuario.controller";
import { UsuarioService } from "./usuario.service";

const factory = () => {
  const service = new UsuarioService();
  const controller = new UsuarioController(service);
  return controller;
};

export default factory();
