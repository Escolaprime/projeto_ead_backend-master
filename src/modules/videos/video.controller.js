import db from "@shared/database/knex";
import { AppError } from "@shared/errors/AppError";
import {
  UploadFileToBucket,
  downloadFileFromBucket,
  getVideoStream,
} from "@shared/providers/Supabase/Storage";
import { generateHash } from "@shared/providers/hash";
import { loggerAudit } from "@shared/providers/logger";

export class VideoController {
  videoService;
  constructor(videoService) {
    this.videoService = videoService;
  }

  async streaming_video(req, res) {
    const range = req.headers.range;
    const { hash: hash_video_id } = req.query;
    if (!range) {
      return res.status(400).json({ status: "error" });
    }

    try {
      var [rows] = await db.table("videos").select("*").where({
        hash_video_id,
        autorizado: true,
        ativo: true,
      });

      if (!rows) {
        throw new AppError("Not Video provided", 400);
      }
      const { url, tamanho: size } = rows;

      const CHUNK_SIZE = 12 ** 6; // 1MB
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, size - 1);
      const contentLength = end - start + 1;

      const headers = {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
      };

      res.set(headers);
      const { publicUrl } = await getVideoStream(url);
      return res.json({ link: publicUrl });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async obter_video(req, res) {
    const { etapa_id, escola_id, dia_id, semana_id } = req.query;

    if (dia_id || semana_id) {
      try {
        var rows = await db
          .table("videos AS vd")
          .select(
            "vd.id",
            "vd.etapa_id",
            "vd.escola_id",
            "vd.hash_video_id",
            "vd.form",
            "vd.titulo",
            "vd.descricao",
            "vd.semana_id",
            "vd.dia_id",
            db.raw(
              "prof.primeiro_nome || ' - ' || prof.segundo_nome AS professor"
            )
          )
          .join("professores AS prof", "vd.professor_id", "=", "prof.id")
          .where("vd.etapa_id", etapa_id)
          .andWhere("vd.ativo", true)
          .andWhere("vd.autorizado", true)
          .andWhere("vd.dia_id", dia_id)
          .andWhere("vd.semana_id", semana_id)
          .orderBy("vd.ordem", "asc");
      } catch (error) {
        throw error;
      }

      rows.map(({ form }, index) => {
        rows[index].links = [
          {
            titulo: "Formulário",
            link: form,
          },
        ];
      });

      return res.json(rows);
    }

    try {
      const rows = await db
        .table("videos AS vd")
        .select(
          "vd.id",
          "vd.etapa_id",
          "vd.escola_id",
          "vd.hash_video_id",
          "vd.form",
          "vd.titulo",
          "vd.descricao",
          db.raw(
            "prof.primeiro_nome || ' - ' || prof.segundo_nome AS professor"
          )
        )
        .join("professores AS prof", "vd.professor_id", "=", "prof.id")
        .where("vd.etapa_id", etapa_id)
        .andWhere("vd.escola_id", escola_id)
        .andWhere("vd.ativo", true)
        .andWhere("vd.autorizado", true)
        .orderBy("vd.ordem", "asc");
      return res.json(rows);
    } catch (error) {
      return res.json({ err: error.toString() });
    }
  }

  async obter_videos_ajuda(req, res) {
    try {
      const rows = await db
        .table("videos AS vd")
        .select(
          "vd.id",
          "vd.etapa_id",
          "vd.escola_id",
          "vd.hash_video_id",
          "vd.titulo",
          "vd.descricao",
          db.raw("true AS ajuda")
        )
        .where("vd.etapa_id", 5);
      return res.json(rows);
    } catch (error) {
      throw error;
    }
  }
  async download_video(req, res) {
    const { hash_video_id } = req.query;

    try {
      var rows = await db
        .table("videos")
        .select("url")
        .where({ hash_video_id });
    } catch (error) {
      return res.json({ err: error.toString() });
    }

    const [{ url }] = rows;
    try {
      res.set({
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="downloadvideo.mp4"',
      });
      const blob = await downloadFileFromBucket({
        fileName: url,
        download: true,
      });
      res.type(blob.type);
      res.send(blob);
    } catch (error) {
      throw new AppError("Error ao baixar video");
    }
  }

  async upload_video(req, res) {
    const { filename: url, mimetype: mime_type, size: tamanho } = req.file;
    const { detalhes } = req.body;

    const toObj = JSON.parse(detalhes);
    const timestamp = new Date().getTime().toString();
    const hash_video_id = await generateHash(timestamp, 5);
    try {
      await UploadFileToBucket({ file: req.file });
      await db.table("videos").insert({
        ...toObj,
        url,
        mime_type,
        tamanho,
        hash_video_id,
      });
      return res.json({ mensagem: "Video postado com sucesso" });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async removerVideo(req, res) {
    const user = req.user;
    if (![7].includes(user.grupo_id))
      throw new AppError("Você não tem permissão para fazer esta ação", 403);
    const videoId = Number(req.params.videoId);
    const [video] = await db
      .table("videos")
      .select("id", "url", "titulo")
      .where({ id: videoId });
    await this.videoService.deletarVideo(video);
    loggerAudit.log(
      `O usuário ${user.nome} deletou o video ${video.id} ${video.titulo}`,
      "DELETE"
    );
    return res.json({ mensagem: "Video deletado com sucesso" });
  }

  async atualizarContagemForm(req, res) {
    const body = req.body;
    await this.videoService.atualizarContagemForm(body);

    return res.status(202).json();
  }
}
