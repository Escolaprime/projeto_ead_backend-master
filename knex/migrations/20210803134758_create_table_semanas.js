exports.up = function (knex) {
    
    return knex.schema.createTable('semanas', table => {
        table.increments('id');
        table.string('titulo');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('semanas')
};
