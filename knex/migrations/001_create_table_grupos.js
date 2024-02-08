
exports.up = function(knex) {

    return knex.schema.createTable('grupos', (table) => {
      table.increments('id');
      table.string('nome_grupo');
      table.string('descricao')
    });

};

exports.down = function(knex) {
  return knex.schema.dropTable('grupos')
};
