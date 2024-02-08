import { ProfessorController } from "./professor.controller";
import { ProfessorService } from "./professor.service";

const factory = () => {
  const service = new ProfessorService();
  const controller = new ProfessorController(service);
  return controller;
};

export default factory();
