import Knex from "knex";

const db = Knex({
  client: "pg",
  connection: {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
});

export default db;
