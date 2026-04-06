// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Knex } from "knex";

declare module "knex/types/tables.js" {
  export interface Tables {
    transactions: {
      id: string;
      title: string;
      amount: number;
      created_at: string;
      session_id?: string;
    };
  }
}
