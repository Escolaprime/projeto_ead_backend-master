import { app } from "./app";
import { HTTP_PORT, NODE_ENV } from "../utils/enviroments";
import logger from "../utils/logger";

const PORT = HTTP_PORT || 3000;

export const server = app.listen(PORT, () => {
  logger.info(`Aplicação está rodando na porta ${PORT}`);
  logger.info(`Ambiente: ${NODE_ENV}`);
});
