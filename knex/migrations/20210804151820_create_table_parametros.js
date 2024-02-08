exports.up = function (knex) {
    
    return knex.schema.createTable('parametros', table => {
        table.increments('id');
        table.string('classe_param');
        table.string('parametro');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('parametros')
};
