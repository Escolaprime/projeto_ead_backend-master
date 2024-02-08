import logger from "../utils/logger";
import { AppError } from "./AppError";

export const handleAppError = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      statusCode: error.statusCode,
      message: error.message,
    });
  }
  logger.error(error);
  return res.status(500).json({
    status: "internal server error",
    statusCode: 500,
    message: "Erro interno do servidor",
  });
};

export const handleNotFound = (req, res, next) => {
  return res.status(404).json({
    error: "not found",
    message: `O recurso ${req.method} ${req.path} não foi encontrado`,
  });
};
