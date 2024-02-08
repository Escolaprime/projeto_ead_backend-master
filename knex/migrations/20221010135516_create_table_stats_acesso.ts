import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTableIfNotExists("stats_acesso", (table) => {
    table.increments("id");
    table.integer("aluno_id").references("alunos.id");
    table.dateTime("acessado_em").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTableIfExists("stats_acesso");
}
