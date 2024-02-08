
exports.up = function(knex) {

    return knex.schema.createTable('escolas', (table) => {
      table.increments('id');
      table.string('nome_escola');
    });

};

exports.down = function(knex) {
  return knex.schema.dropTable('escolas')
};
