import { generateHash } from "@shared/providers/hash";
import db from "@shared/database/knex";

export class UploadController {
  uploadService;
  constructor(uploadService) {
    this.uploadService = uploadService;
  }

  async uploadFile(req, res) {
    const { path: url, mimetype: mime_type, size: tamanho } = req.file;

    const { detalhes } = req.body;
    const timestamp = new Date().getTime().toString();
    const toObj = JSON.parse(detalhes);
    const hash_video_id = await generateHash(timestamp, 5);

    try {
      await db.table("cursos_videos").insert({
        ...toObj,
        url,
        mime_type,
        tamanho,
        hash_video_id,
      });
    } catch (error) {
      return res.status(500).send({ err: error.toString() });
    }

    return res.send({ mensagem: "Video postado com sucesso" });
  }
}
