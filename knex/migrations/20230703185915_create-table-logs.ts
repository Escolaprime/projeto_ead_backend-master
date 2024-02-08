import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTableIfNotExists("logs", (table) => {
    table.increments("id");
    table.text("descricao");
    table.datetime("criado_em").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTableIfExists("logs");
}
