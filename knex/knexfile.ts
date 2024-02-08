import type { Knex } from "knex";
import { config as envConfig } from "dotenv";

envConfig({ path: `${process.cwd()}/../.env` });
const config: { [key: string]: Knex.Config } = {
  development: {
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
    migrations: {
      directory: `${process.cwd()}/migrations`,
      tableName: "knex_migrations",
    },
    seeds: {
      directory: `${process.cwd()}/seeds`,
    },
  },
  production: {
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
    migrations: {
      directory: `${process.cwd()}/migrations`,
      tableName: "knex_migrations",
    },
    seeds: {
      directory: `${process.cwd()}/seeds`,
    },
  },
};

module.exports = config;
