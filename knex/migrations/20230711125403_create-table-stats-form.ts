import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTableIfNotExists("stats_form", (table) => {
    table.increments("id");
    table.integer("aluno_id").references("alunos.id").onDelete("CASCADE");
    table.integer("video_id").references("videos.id").onDelete("CASCADE");
    table.string("form", 255);
    table.dateTime("criado_em", { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTableIfExists("stats_form");
}
