
exports.up = function(knex) {

    return knex.schema.createTable('alunos', (table) => {
        table.increments('id');
        table.integer('etapa_id').references('etapas.id');
        table.integer('escola_id').references('escolas.id');
        table.string('numero_matricula').unique();
        table.string('primeiro_nome');
        table.string('segundo_nome');
    });

};

exports.down = function(knex) {
  return knex.schema.dropTable('alunos')
};
