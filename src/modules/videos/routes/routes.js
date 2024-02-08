import { Router } from "express";
import videoFactory from "../video.factory";
import upload from "@shared/providers/upload/upload";
const router = Router();

router.get("/streamingVideo/", (req, res) =>
  videoFactory.streaming_video(req, res)
);
router.get("/obterVideo", (req, res) => videoFactory.obter_video(req, res));
router.get("/downloadVideo", (req, res) =>
  videoFactory.download_video(req, res)
);
router
  .use(upload.single("video"))
  .post("/uploadVideo", (req, res) => videoFactory.upload_video(req, res));

router.get("/obterVideosAjuda", (req, res) =>
  videoFactory.obter_videos_ajuda(req, res)
);

router.delete("/deletar-video/:videoId", (req, res) =>
  videoFactory.removerVideo(req, res)
);

router.put("/contagem", (req, res) =>
  videoFactory.atualizarContagemForm(req, res)
);
export default router;
