import myKnex from "knex";
import type { Knex } from "knex";
import { env } from "./env/index.js";

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

const db = myKnex(config);

export default db;
