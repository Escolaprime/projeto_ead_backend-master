
exports.up = function(knex) {
    return knex.schema.raw(
        `
        ALTER TABLE
        videos
        ADD COLUMN semana_id INTEGER,
        ADD COLUMN dia_id INTEGER
        `
    )
};

exports.down = function(knex) {
    return knex.schema.raw(
        `
        ALTER TABLE
        videos
        DROP COLUMN semana_id,
        DROP COLUMN dia_id
        `
    )
};
