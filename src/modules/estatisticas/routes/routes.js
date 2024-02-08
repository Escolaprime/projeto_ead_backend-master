import { Router } from "express";
import estatisticaFactory from "../estatistica.factory";



const router = Router();

router.post("/videosAlunos", (req,res) => estatisticaFactory.inserir_estatisticas_videos(req,res));

router.patch("/videosAlunos", (req,res) => estatisticaFactory.atualizar_estatistica_video(req,res))
export default router;