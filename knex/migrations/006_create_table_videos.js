
exports.up = function(knex) {

    return knex.schema.createTable('videos', (table) => {
      table.increments('id');
      table.integer('escola_id').references('escolas.id');
      table.integer('etapa_id').references('etapas.id');
      table.integer('professor_id').references('professores.id');
      table.string('titulo');
      table.string('descricao');
      table.string('url');
      table.string('mime_type');
      table.bigInteger('tamanho');
      table.integer('qtd_baixados').defaultTo(0);
      table.string('hash_video_id');
      table.timestamp('data_postagem').defaultTo(knex.fn.now());
      table.boolean('ativo').defaultTo(false);
      table.boolean('autorizado').defaultTo(false);
      table.string("form");
      table.string('ordem');
    });

};

exports.down = function(knex) {
  return knex.schema.dropTable('videos')
};
