import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import router from "./routes";
import { handleAppError, handleNotFound } from "../errors/handle";
import morgan from "morgan";

export const app = express();
app.use(
  morgan("dev", {
    skip: (req, res) => /streaming/g.test(req.path),
  })
);
app.use(cors());

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(router);
app.use(handleAppError);
app.use(handleNotFound);
