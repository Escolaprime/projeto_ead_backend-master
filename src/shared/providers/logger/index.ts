import type { Knex } from "knex";
import db from "@shared/database/knex";
import logger from "@shared/utils/logger";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import dayjs from "dayjs";
dayjs.extend(utc);
dayjs.extend(tz);
type LogType = "CREATE" | "UPDATE" | "INSERT" | "DELETE";
class Logger {
  constructor(private readonly knex: Knex) {}
  log(message: string, type: LogType) {
    const date = dayjs(new Date())
      .tz("America/Recife")
      .format("YYYY-MM-DD HH:mm:ss");
    this.knex
      .table("logs")
      .insert({
        descricao: `[${type}] ${message}`,
        criado_em: date,
      })
      .then(() => {
        logger.info(message);
      })
      .catch((error) => {
        logger.error(error);
      });
  }
}

export const loggerAudit = new Logger(db);
