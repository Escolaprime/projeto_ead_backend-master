
exports.up = function(knex) {
    return knex.schema.raw(
        `
        ALTER TABLE
        semanas
        ADD COLUMN ativo BOOLEAN
        `
    )
};

exports.down = function(knex) {
    return knex.schema.raw(
        `
        ALTER TABLE
        semanas
        DROP COLUMN ativo
        `
    )
};