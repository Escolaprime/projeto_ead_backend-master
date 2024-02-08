import upload from "@shared/providers/upload/upload";
import { Router } from "express";
import uploadFactory from "../upload.factory";

const router = Router();
router.use(upload.single("video")).post("/", uploadFactory.uploadFile);

export default router;
