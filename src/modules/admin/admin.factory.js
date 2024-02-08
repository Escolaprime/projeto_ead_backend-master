import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

const factory = () => {
  const service = new AdminService();
  const controller = new AdminController(service);
  return controller;
};

export default factory();
