
exports.up = function(knex) {
    return knex.schema.raw(
        `
        ALTER TABLE
        grupos
        ADD COLUMN permissao_id INTEGER;

        ALTER TABLE
        grupos
        ADD FOREIGN KEY (permissao_id) REFERENCES permissoes(id)
        `
    )
};

exports.down = function(knex) {
    return knex.schema.raw(
        `
        ALTER TABLE
        grupos
        DROP COLUMN permissao_id
        `
    )
};