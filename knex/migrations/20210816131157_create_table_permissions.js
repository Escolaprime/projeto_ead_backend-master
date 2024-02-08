exports.up = function (knex) {
    return knex.schema.createTable("permissoes", (table) => {
      table.increments("id");
      table.string("titulo");
      table.string("descricao");
      table.integer("nivel");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("permissoes");
  };
  