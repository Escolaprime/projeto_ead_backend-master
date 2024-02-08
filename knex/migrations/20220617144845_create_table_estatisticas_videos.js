/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
return knex.schema.createTable('stats_videos', table => {
    table.increments('id');
    table.integer('video_id').references('videos.id');
    table.integer('aluno_id').references('alunos.id');
    table.integer('percentual_assistido');
    table.float('tempo_assistido');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function (knex) {
    return knex.schema.dropTable('stats_videos');
  };