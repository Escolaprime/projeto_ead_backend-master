import type { Knex } from "knex";
import xlsx from "json-as-xlsx";
import {
  lastDayOfMonth,
  startOfMonth,
  startOfToday,
  format,
  parseISO,
} from "date-fns";
import { AppError } from "@shared/errors/AppError";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(tz);
export class RelatorioService {
  constructor(private knex: Knex) {}

  async create(aluno: any) {
    return await this.knex.table("stats_acesso").insert(aluno);
  }

  async generateChartOne(escolaId: number) {
    const today = startOfToday();
    const months = Array.from(Array(12).keys());
    const report = [];
    for (let month of months) {
      const date = new Date(today.getFullYear(), month, 1);
      const monthIntervals = {
        start: format(startOfMonth(date), "yyyy-MM-dd"),
        end: format(lastDayOfMonth(date), "yyyy-MM-dd"),
      };
      const { rows } = await this.knex.raw(`
      SELECT
        COUNT(aluno_id) as qtd_login
      FROM
        stats_acesso
      WHERE
        acessado_em 
      BETWEEN '${monthIntervals.start}' AND '${monthIntervals.end}'
      AND aluno_id IN (
        SELECT
          id
        FROM
          alunos
        WHERE
          escola_id = ${escolaId}
      )
      `);
      const q = rows.map((row) => ({
        qtd: Number(row.qtd_login),
        mes: format(date, "MMMM"),
      }));
      report.push(q);
    }
    return report.flatMap((logins) => logins);
  }

  async generateChartAcessosPorEscola(escola_id: number) {
    const { rows } = await this.knex.raw(
      `
        SELECT
          COUNT(id)
        FROM
          stats_acesso
        WHERE
          aluno_id IN (
            SELECT
              id
            FROM
              alunos
            WHERE
              escola_id = ?
        )
    `,
      [escola_id]
    );

    return rows;
  }
  async generateRelatoriosByAlunos(search: string) {
    try {
      const aluno = await this.knex
        .table("alunos as al")
        .select(
          "al.id AS aluno_id",
          "al.primeiro_nome",
          "al.segundo_nome",
          "al.numero_matricula",
          "et.id AS etapa_id",
          "et.titulo AS etapa_titulo",
          "es.id AS escola_id",
          "es.nome_escola"
        )
        .join("etapas AS et", "al.etapa_id", "=", "et.id")
        .join("escolas AS es", "al.escola_id", "=", "es.id")

        .where((qd) => {
          qd.where("al.numero_matricula", search).orWhere(
            "al.primeiro_nome",
            "ilike",
            `%%${search}%%`
          );
        });

      if (!aluno.length) throw new AppError("Aluno não encontrado");

      const [
        { aluno_id, primeiro_nome, segundo_nome, etapa_titulo, nome_escola },
      ] = aluno;
      const { rows } = (await this.knex.raw(
        `
          SELECT
            ROUND(AVG(percentual_assistido)) as media_percentual,
            ROUND(AVG(tempo_assistido)) as media_tempo
          FROM
            stats_videos
          WHERE aluno_id = ??;
      `,
        aluno_id
      )) as any;
      const [chart] = rows;
      return {
        chart,
        aluno: {
          nome: `${primeiro_nome} ${segundo_nome}`,
          etapa_titulo,
          nome_escola,
        },
      };
    } catch (error) {
      throw error;
    }
  }
  async downloadLoginsAlunos(date?: any) {
    const params = JSON.parse(date);
    const dates = {
      start: format(parseISO(params.start), "yyyy-MM-dd"),
      end: format(parseISO(params.end), "yyyy-MM-dd"),
    };
    const { rows } = (await this.knex.raw(`
    SELECT
    al.primeiro_nome,
    al.numero_matricula,
    esc.nome_escola,
    stats.acessado_em
  FROM
    stats_acesso as stats
    RIGHT JOIN alunos as al ON stats.aluno_id = al.id
    RIGHT JOIN escolas as esc ON esc.id = al.escola_id
    WHERE 
      stats.acessado_em::DATE BETWEEN '${dates.start}' AND '${dates.end}'
    `)) as any;
    const escolas = rows
      .map((row: any) => row.nome_escola)
      .reduce((a, b) => {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, []);
    const columns = [
      {
        label: "Nome do aluno",
        value: "primeiro_nome",
      },
      {
        label: "Matricula",
        value: "numero_matricula",
      },
      {
        label: "Data de acesso",
        value: "acessado_em",
      },
    ];
    const data = escolas.map((row: any) => ({
      sheet: row.substr(0, 31).toUpperCase(),
      columns,
      content: rows
        .map((data) => {
          if (row === data.nome_escola) return data;
        })
        .filter(Boolean),
    }));
    return xlsx(data, {
      fileName: "relatorios_logins",
      extraLength: 5,
      writeOptions: {
        type: "buffer",
      },
    });
  }
  async donwloadPercentualAssitido() {
    const { rows } = (await this.knex.raw(`
    SELECT
    al.primeiro_nome,
    al.numero_matricula,
    esc.nome_escola,
    AVG(stats.tempo_assistido) as media_tempo,
    AVG(stats.percentual_assistido) as media_percentual
  FROM
    stats_videos as stats
    RIGHT JOIN alunos as al ON stats.aluno_id = al.id
    RIGHT JOIN escolas as esc ON al.escola_id = esc.id
  GROUP BY
    al.primeiro_nome,
    al.numero_matricula,
    esc.nome_escola
    `)) as any;
    const escolas = rows
      .map((row: any) => row.nome_escola)
      .reduce((a, b) => {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, []);
    const columns = [
      {
        label: "Nome do aluno",
        value: "primeiro_nome",
      },
      {
        label: "Matricula",
        value: "numero_matricula",
      },
      {
        label: "Tempo médio assistido",
        value: (row) => Math.round(row.media_tempo) + " minutos",
      },
      {
        label: "Percentual médio assistido",
        value: (row) => Math.round(row.media_percentual) + "%",
      },
    ];
    const data = escolas.map((row: any) => ({
      sheet: row.substr(0, 31).toUpperCase(),
      columns,
      content: rows
        .map((data) => {
          if (row === data.nome_escola) return data;
        })
        .filter(Boolean),
    }));
    return xlsx(data, {
      fileName: "relatorios_logins",
      extraLength: 5,
      writeOptions: {
        type: "buffer",
      },
    });
  }

  async donwloadLogs(date?: any) {
    const params = JSON.parse(date);
    const dates = {
      start: format(parseISO(params.start), "yyyy-MM-dd"),
      end: format(parseISO(params.end), "yyyy-MM-dd"),
    };
    const { rows: logs } = await this.knex.raw(`
      SELECT 
        descricao, criado_em 
      FROM 
        logs 
      WHERE 
        criado_em::DATE 
          BETWEEN '${dates.start}' AND '${dates.end}'
    `);
    const columns = [
      {
        label: "Data",
        value: (row) => dayjs(row.criado_em).format("DD/MM/YYYY HH:hh"),
      },
      {
        label: "Evento",
        value: "descricao",
      },
    ];
    const data = [{ columns, sheet: "Log de auditoria", content: logs }];
    return xlsx(data, {
      extraLength: 5,
      fileName: "relatorio-auditoria-logs",
      writeOptions: {
        type: "buffer",
      },
    });
  }
  async downloadForm(date: any) {
    const params = date
      ? JSON.parse(date)
      : { start: new Date(), end: new Date() };
    console.log(params);
    const dates = {
      start: dayjs(params.start).format("YYYY-MM-DD"),
      end: dayjs(params.end).format("YYYY-MM-DD"),
    };
    console.log(dates);
    const columns = [
      {
        label: "Nome do aluno",
        value: "primeiro_nome",
      },
      {
        label: "Nº da matrícula",
        value: "numero_matricula",
      },
      {
        label: "Titulo do video",
        value: "titulo",
      },
      {
        label: "Formulário",
        value: "form",
      },
      {
        label: "Clicado em",
        value: (row) =>
          dayjs(row.criado_em)
            .tz("America/Recife")
            .format("DD/MM/YYYY [ás] HH:hh"),
      },
    ];

    const { rows: data } = await this.knex.raw(`
      SELECT
        al.primeiro_nome,
        al.numero_matricula,
        vd.titulo,
        stats.form,
        stats.criado_em
      FROM
        stats_form as stats
        INNER JOIN alunos as al ON stats.aluno_id = al.id
        INNER JOIN videos as vd on stats.video_id = vd.id
      WHERE 
        stats.criado_em::DATE BETWEEN '${dates.start}' AND '${dates.end}'
    `);
    return xlsx(
      [{ columns, sheet: "Relatório de formulário", content: data }],
      {
        fileName: "relatorio-cliques-form",
        writeOptions: {
          type: "buffer",
        },
      }
    );
  }
}
