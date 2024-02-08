
exports.up = function(knex) {

    return knex.schema.createTable('etapas', (table) => {
      table.increments('id');
      table.integer('escola_id').references('escolas.id');
      table.string('titulo');
      table.string('descricao');
    });

};

exports.down = function(knex) {
  return knex.schema.dropTable('etapas')
};
