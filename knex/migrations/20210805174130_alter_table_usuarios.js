
exports.up = function(knex) {
    return knex.schema.raw(
        `
        ALTER TABLE
        usuarios
        ADD COLUMN nome VARCHAR,
        ADD COLUMN criado_em TIMESTAMP default now(),
        ADD COLUMN ativo BOOLEAN
        `
    )
};

exports.down = function(knex) {
    return knex.schema.raw(
        `
        ALTER TABLE
        usuarios
        DROP COLUMN nome,
        DROP COLUMN criado_em,
        DROP COLUMN ativo
        `
    )
};