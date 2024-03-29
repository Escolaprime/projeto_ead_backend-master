import db from "@shared/database/knex";
import { AppError } from "@shared/errors/AppError";
import { removeVideo } from "@shared/providers/Supabase/Storage";
import logger from "@shared/utils/logger";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(tz);

export class VideoService {
  async atualizar_contagem(hash_video_id, res) {
    try {
      await db
        .table("videos")
        .increment("qtd_baixados")
        .where({ hash_video_id });
    } catch (error) {
      return {
        err: error.toString(),
        success: false,
      };
    }

    return {
      err: null,
      success: true,
    };
  }
  async atualizarContagemForm(data) {
    try {
      return await db.table("stats_form").insert({
        ...data,
      });
    } catch (error) {
      logger.error(error);
      throw new AppError("Error Interno", 500);
    }
  }

  async deletarVideo(video) {
    try {
      await removeVideo(video.url);
      return await db.table("videos").del().where({ id: video.id });
    } catch (error) {
      logger.error(error);
      throw new AppError("Error interno", 500);
    }
  }
}
