
exports.up = function(knex) {

    return knex.schema.createTable('professores', (table) => {
      table.increments('id');
      table.integer('escola_id').references('escolas.id');
      table.string('primeiro_nome');
      table.string('segundo_nome');
    });

};

exports.down = function(knex) {
  return knex.schema.dropTable('professores')
};
