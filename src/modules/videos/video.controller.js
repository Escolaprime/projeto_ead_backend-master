import { AppError } from "@shared/errors/AppError";
import { streamFile, removeFile } from "@shared/providers/fs/fs";
import { generateHash } from "@shared/providers/hash";
import { MEDIA_PATH, NODE_ENV } from "@shared/utils/enviroments";
import db from "@shared/database/knex";
import { loggerAudit } from "@shared/providers/logger";
import { UploadFileToBucket } from "@shared/providers/Supabase/Storage";

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
    } catch (error) {
      throw error;
    }

    if (!rows) {
      throw new AppError("Not Video provided", 400);
    }

    const { url, mime_type, tamanho: size } = rows;

    const CHUNK_SIZE = 12 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, size - 1);
    const contentLength = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": mime_type,
    };

    res.writeHead(206, headers);
    const path = NODE_ENV === "production" ? MEDIA_PATH : "./tmp/videos";
    const stream = streamFile(`${path}/${url}`, { start, end });

    stream.pipe(res);
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
    const path = NODE_ENV === "production" ? MEDIA_PATH : "./tmp/videos";
    try {
      const stream = streamFile(`${path}/${url}`);
      res.set({
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="downloadvideo.mp4"',
      });
      stream.on("error", () => {
        return res.status(500).json({ message: "Error ao processar video" });
      });
      stream.on("close", async () => {
        const { err } = await this.videoService.atualizar_contagem(
          hash_video_id
        );

        if (err) {
          return res.status(500).json(err);
        }
      });

      stream.pipe(res);
    } catch (error) {
      throw new AppError("Error ao baixar video");
    }
  }

  async upload_video(req, res) {
    const { filename: url, mimetype: mime_type, size: tamanho } = req.file;
    console.log(req.file)
    const { detalhes } = req.body;
   
    const timestamp = new Date().getTime().toString();
    const toObj = JSON.parse(detalhes);
    const hash_video_id = await generateHash(timestamp, 5);
    try {
      await UploadFileToBucket(url, req.file)
      await db.table("videos").insert({
        ...toObj,
        url,
        mime_type,
        tamanho,
        hash_video_id,
      });
      return res.json({ mensagem: "Video postado com sucesso" });
    } catch (error) {
      const path = NODE_ENV === "production" ? MEDIA_PATH : "./tmp/videos";
      await removeFile(`${path}/${url}`);
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
