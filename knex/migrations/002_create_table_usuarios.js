
exports.up = function(knex) {

    return knex.schema.createTable('usuarios', (table) => {
      table.increments('id');
      table.integer('grupo_id').references('grupos.id');
      table.string('email').unique();
      table.text('senha');
      table.string('hash');

    });

};

exports.down = function(knex) {
  return knex.schema.dropTable('usuarios')
};
