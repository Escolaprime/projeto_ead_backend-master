import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable("stats_acesso", (table) => {
    table.dropForeign("aluno_id");
    table.foreign("aluno_id").references("alunos.id").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTableIfExists("stats_acesso");
}
