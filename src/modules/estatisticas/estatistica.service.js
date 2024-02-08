import db from "@shared/database/knex";

export class EstatisticaService {
  async inserir_estatistica_aluno(estatistica) {
    const { progress, currentTime, video_id, aluno_id } = estatistica;
    const exists = await db("stats_videos")
      .select("id")
      .where({ video_id, aluno_id });
    if (exists.length) return;
    try {
      const result = await db("stats_videos").insert({
        video_id,
        aluno_id,
        percentual_assistido: progress,
        tempo_assistido: currentTime,
      });
      return result;
      console.log(result);
    } catch (error) {
      throw error;
    }
  }

  async atualizar_estatistica_aluno(estatisticas) {
    if (Array.isArray(estatisticas)) {
      return await db.transaction((trx) => {
        const queries = [];
        estatisticas.forEach((stat) => {
          const { progress, currentTime, video_id, aluno_id } = stat;
          const query = db("stats_videos")
            .update({
              percentual_assistido: progress,
              tempo_assistido: currentTime,
            })
            .where({ video_id, aluno_id })
            .transacting(trx);
          queries.push(query);
        });

        return Promise.all(queries)
          .then(trx.commit)
          .catch((err) => {
            trx.rollback();
            throw err;
          });
      });
    }
    const { progress, currentTime, video_id, aluno_id } = estatisticas;
    const result = await db("stats_videos")
      .update({
        percentual_assistido: progress,
        tempo_assistido: currentTime,
      })
      .where({ video_id, aluno_id });

    return result;
  }
}
