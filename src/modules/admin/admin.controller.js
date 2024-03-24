import db from "@shared/database/knex";
import { AppError } from "@shared/errors/AppError";
import { UploadFileToBucket, removeVideo } from "@shared/providers/Supabase/Storage";
import { loggerAudit } from "@shared/providers/logger";

export class AdminController {
  adminService;
  constructor(adminService) {
    this.adminService = adminService;
  }
  validate(req, res) {
    return res.json({ is_admin: true });
  }

  async obter_escolas(req, res) {
    const { search } = req.query;

    try {
      const escolas = await db
        .table("escolas")
        .select("*")
        .where("nome_escola", "ilike", `%%${search}%%`);
      return res.json(escolas);
    } catch (error) {
      throw error;
    }
  }

  async editar_escola(req, res) {
    const { nome_escola } = req.body;

    try {
      await db.table("escolas").update({
        nome_escola,
      });
      return res.json({ mensagem: "Escola editada com sucesso" });
    } catch (error) {
      throw error;
    }
  }

  async obter_etapa(req, res) {
    const { search = "" } = req.query;

    try {
      const etapas = await db
        .table("etapas")
        .select("*")
        .where("titulo", "ilike", `%%${search}%%`);
      return res.json(etapas);
    } catch (error) {
      console.log(error.toString());
      throw error;
    }
  }

  async editar_etapa(req, res) {
    const { id, titulo } = req.body;

    try {
      await db
        .table("etapas")
        .update({
          titulo,
        })
        .where({ id });
    } catch (error) {
      console.log(error);
      throw error;
    }

    return res.json({ mensagem: "Etapa editada com sucesso" });
  }

  async obter_alunos(req, res) {
    const { search } = req.query;

    try {
      const aluno = await db
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
            `%%${search}%%`,
            db.raw("COLLATE Latin1_General_CI_AI")
          );
        });
      return res.json(aluno);
    } catch (error) {
      throw error;
    }
  }

  async editar_aluno(req, res) {
    const {
      primeiro_nome,
      segundo_nome,
      idade,
      aluno_id: id,
      escola_id,
      etapa_id,
      numero_matricula,
    } = req.body;
    try {
      await db
        .table("alunos")
        .update({
          primeiro_nome,
          segundo_nome,
          idade,
          escola_id,
          etapa_id,
          numero_matricula,
        })
        .where({ id });
      return res.json({ mensagem: "Aluno atualizado com sucesso" });
    } catch (error) {
      throw error;
    }
  }

  async excluirAlunos(req, res) {
    const nomeEscola = req.params.nomeEscola;
    const escola_id = Number(req.params.escolaId);
    const user = req.user;
    if (!user) throw new AppError("Você precisa estar logado", 401);
    if (![7].includes(user.grupo_id))
      throw new AppError("Você não tem permissão para fazer esta ação", 403);
    return await db
      .table("alunos")
      .where({ escola_id })
      .del()
      .then(() => {
        loggerAudit.log(
          `O usuário ${user.nome} excluiu todos os alunos da escola - ${nomeEscola}`,
          "DELETE"
        );
        return res.json({ mensagem: "Alunos deletados com sucesso" });
      })
      .catch((err) => {
        console.error(err);
        throw new AppError("Error interno", 500);
      });
  }

  async obter_professores(req, res) {
    const { search } = req.query;

    try {
      const professor = await db
        .table("professores AS prof")
        .select(
          "prof.id AS professor_id",
          "prof.primeiro_nome",
          "prof.segundo_nome",
          "es.id AS escola_id",
          "es.nome_escola"
        )
        .join("escolas AS es", "prof.escola_id", "=", "es.id")
        .where("prof.primeiro_nome", "ilike", `%%${search}%%`)
        .andWhere("prof.ativo", "=", true);
      return res.json(professor);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async editar_professor(req, res) {
    const { professor_id: id, primeiro_nome, segundo_nome } = req.body;

    try {
      await db
        .table("professores")
        .update({
          primeiro_nome,
          segundo_nome,
        })
        .where({ id });
      return res.json({ mensagem: "Professor editado com sucesso" });
    } catch (error) {
      throw error;
    }
  }

  async obter_videos(req, res) {
    let WHERE_semana = "";
    let WHERE_dia = "";
    let WHERE = "";

    const { CRC, dados } = req.body.params;

    if (CRC != 9) return res.status(404).json();

    if (!Object.keys(dados).length) return res.status(400).json();

    const {
      semana_id = 99,
      dia_id = 99,
      professor_id = 99,
      etapa_id = 99,
      txt_pesquisa = "",
      ativo = true,
    } = dados;

    if (txt_pesquisa.length > 0) {
      WHERE = "vd.titulo ilike '%%" + txt_pesquisa + "%%'";
    }
    if (semana_id != 0) {
      if (semana_id == 99) {
        WHERE_semana = "";
      } else {
        if (WHERE == "") {
          WHERE_semana = " vd.semana_id = " + semana_id;
        } else {
          WHERE_semana = " AND vd.semana_id = " + semana_id;
        }
      }

      WHERE += WHERE_semana;

      if (dia_id != 0) {
        if (dia_id == 99) {
          WHERE_dia = "";
        } else {
          if (WHERE == "") {
            WHERE_dia = " vd.dia_id = " + dia_id;
          } else {
            WHERE_dia = " AND vd.dia_id = " + dia_id;
          }
        }
      }
      WHERE += WHERE_dia;
    }
    if (professor_id != 0) {
      if (professor_id != 99) {
        if (WHERE == "") {
          WHERE = " vd.professor_id = " + professor_id;
        } else {
          WHERE += " AND vd.professor_id = " + professor_id;
        }
      }
    }
    if (etapa_id != 0) {
      if (etapa_id != 99) {
        if (WHERE == "") {
          WHERE == "";
        } else {
          WHERE += " AND vd.etapa_id = " + etapa_id;
        }
      }
    }

    // VIDEO ATIVO
    if (WHERE == "") {
      WHERE = " vd.ativo = " + ativo;
    } else {
      WHERE += " AND vd.ativo = true";
    }

    try {
      const videos = await db
        .table("videos as vd")
        .select(
          "vd.id AS video_id",
          "vd.titulo",
          "vd.descricao",
          "vd.data_postagem",
          "vd.ativo",
          "vd.autorizado",
          "vd.form",
          "vd.semana_id",
          "vd.dia_id",
          "vd.hash_video_id",
          "es.id AS escola_id",
          "es.nome_escola",
          "et.id AS etapa_id",
          "et.titulo AS etapa_titulo",
          "prof.id AS professor_id",
          "sem.titulo AS semana",
          "dias.titulo AS dia",
          "sem.id AS semana_id",
          "dias.id AS dia_id",
          db.raw(
            "prof.primeiro_nome || ' ' || prof.segundo_nome AS nome_professor"
          )
        )
        .join("etapas AS et", "vd.etapa_id", "=", "et.id")
        .join("escolas AS es", "vd.escola_id", "=", "es.id")
        .join("professores AS prof", "vd.professor_id", "=", "prof.id")
        .join("semanas AS sem", "vd.semana_id", "=", "sem.id")
        .join("dias", "vd.dia_id", "=", "dias.id")
        //.where('vd.titulo', 'ilike', `%%${txt_pesquisa}%%`, db.raw('COLLATE Latin1_General_CI_AI'))
        .whereRaw(WHERE);
      // .where((qd) => {

      //     qd.where('vd.titulo', 'ilike', `%%${search}%%`, db.raw('COLLATE Latin1_General_CI_AI'))
      // });

      if (videos.length > 0) {
        return res.json({ codigo: 0, dados: videos, mensagem: "" });
      } else {
        return res.json({
          codigo: 1,
          dados: "",
          mensagem: "INFO:: Sem resultados pra o critério de busca.",
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async editar_video(req, res) {
    const { filename: url, mimetype: mime_type, size: tamanho } = req.file;

    const { hash_video_id } = req.headers;
    const [path] = await db
      .table("videos")
      .select("url")
      .where({ hash_video_id });

    try {
      await removeVideo(path.url);
      await UploadFileToBucket({ file: req.file, fileName: url });
      await db.transaction((trx) => {
        db("videos")
          .update({ url, mime_type, tamanho })
          .where({ hash_video_id })
          .then(trx.commit());
      });
    } catch (error) {
      throw error;
    }

    return res.json({ mensagem: "Video atualizado com sucesso" });
  }

  async streaming_video(req, res) {
    const range = req.headers.range;
    const { hash: hash_video_id } = req.query;
    if (!range) {
      return res.status(400).json("Requires Range header");
    }

    const [rows] = await db.table("videos").select("*").where({
      hash_video_id,
    });

    const { url, tamanho: size  } = rows;

    const CHUNK_SIZE = 12 ** 6; // 1MB
    let start = Number(range.replace(/\D/g, ""));
    let end = Math.min(start + CHUNK_SIZE, size - 1);
    let contentLength = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
    };

    res.set(headers);
    const { publicUrl } = await getVideoStream(url);
    return res.json({ link: publicUrl });
  }

  async editar_informacoes_video(req, res) {
    const {
      video_id: id,
      etapa_id,
      escola_id,
      professor_id,
      titulo,
      descricao,
      ativo,
      autorizado,
      semana_id,
      dia_id,
      form,
    } = req.body;

    try {
      await db
        .table("videos")
        .update({
          etapa_id,
          escola_id,
          professor_id,
          titulo,
          descricao,
          ativo,
          autorizado,
          semana_id,
          dia_id,
          form,
        })
        .where({ id });
      return res.json({ mensagem: "Informações atualizadas com sucesso" });
    } catch (error) {
      throw error;
    }
  }
  async criarSemana(req, res) {
    try {
      const semana = req.body;
      await db.table("semanas").insert({ ...semana, ativo: false });

      return res.json({ mensagem: "Semana criada com sucesso" });
    } catch (error) {
      console.error(error);
      throw new AppError("Error interno", 500);
    }
  }

  async obter_semanas(req, res) {
    try {
      const rows = await db.table("semanas").select("*").orderBy("id", "asc");
      return res.json(rows);
    } catch (error) {
      console.error(error);
      throw new AppError("Error interno", 500);
    }
  }
  async editarSemana(req, res) {
    try {
      const { id, titulo, ativo } = req.body;
      await db.table("semanas").update({ titulo, ativo }).where({ id });

      return res.json({ mensagem: "Semana editada com sucesso !" });
    } catch (error) {
      console.error(error);
      throw new AppError("Error interno", 500);
    }
  }

  async obter_dias(req, res) {
    try {
      const rows = await db.table("dias").select("*").orderBy("id", "asc");

      return res.json(rows);
    } catch (error) {
      return res.status(500).json({ err: error.message });
    }
  }
}
