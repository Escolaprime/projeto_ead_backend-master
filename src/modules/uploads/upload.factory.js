import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

const factory = () => {
  const service = new UploadService();
  const controller = new UploadController(service);
  return controller;
};

export default factory();
