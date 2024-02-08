import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable("professores", (table) => {
    table.boolean("ativo").defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.alterTable("professores", (table) => {
    table.dropColumn("ativo");
  });
}
