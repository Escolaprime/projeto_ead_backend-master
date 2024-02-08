import { AppError } from "@shared/errors/AppError";
import { RelatorioService } from "./relatorio.service";
import { Request, Response } from "express";
export class RelatorioController {
  constructor(private relatorioService: RelatorioService) {}

  async downloadRelatorios(req: Request, res: Response) {
    const params = req.query;

    if (!params && !params.report)
      throw new AppError("Informe o tipo de relatório para baixar", 400);

    if (params.report === "login") {
      const data = await this.relatorioService.downloadLoginsAlunos(
        params.date
      );
      res.setHeader(
        "Content-disposition",
        "attachment; filename=relatorios-login.xlsx"
      );
      res.setHeader("Content-type", "application/octet-stream");
      return res.send(data);
    }
    if (params.report === "video") {
      const data = await this.relatorioService.donwloadPercentualAssitido();
      res.setHeader(
        "Content-disposition",
        "attachment; filename=relatorios-percentual.xlsx"
      );
      res.setHeader("Content-type", "application/octet-stream");
      return res.send(data);
    }

    if (params.report === "log") {
      const data = await this.relatorioService.donwloadLogs(params.date);
      res.setHeader(
        "Content-disposition",
        "attachment; filename=relatorios-auditoria-log.xlsx"
      );
      res.setHeader("Content-type", "application/octet-stream");
      return res.send(data);
    }
    if (params.report === "form") {
      const data = await this.relatorioService.downloadForm(params.date);
      res.setHeader(
        "Content-disposition",
        "attachment; filename=relatorios-formulario-cliques.xlsx"
      );
      res.setHeader("Content-type", "application/octet-stream");
      return res.send(data);
    }
    return res.status(404).json({ message: "Relatório não encontrado" });
  }
}
