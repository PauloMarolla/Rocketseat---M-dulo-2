import knex from "knex";

const db = knex({
  client: "sqlite",
  connection: {
    filename: "./temp/app.db",
  },
});

export default db;
