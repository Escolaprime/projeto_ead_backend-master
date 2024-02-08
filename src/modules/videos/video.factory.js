import { VideoController } from "./video.controller";
import { VideoService } from "./video.service";

const factory = () => {
  const service = new VideoService();
  const controller = new VideoController(service);
  return controller;
};

export default factory();
