import { ApkController } from "./apk.controller";
import { ApkService } from "./apk.service";

const factory = () => {
  const service = new ApkService();
  const controller = new ApkController(service);
  return controller;
};

export default factory();
