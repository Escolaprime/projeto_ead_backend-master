import type { Knex } from "knex";

export class AlunoKnexRepository {
  private knex: Knex.QueryBuilder;
  constructor(knex: Knex) {
    this.knex = knex("alunos");
  }

  async create<T = any | any[]>(data: T) {
    return await this.knex.insert(data, "*");
  }

  async findAll(...args: string[]) {
    return await this.knex.select(...args);
  }
}
