import type { FastifyInstance } from "fastify";
import { z } from "zod";
import db from "../database.js";
import { randomUUID } from "crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists.js";

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async () => {
    console.log("aa");
  });

  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies;

      const transactions = await db("transactions")
        .where({ session_id: sessionId })
        .select("*");

      return {
        transactions,
      };
    },
  );

  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionParamsSchema = z.object({
        id: z.string(),
      });

      const { sessionId } = request.cookies;

      const { id } = getTransactionParamsSchema.parse(request.params);

      const transactions = await db("transactions")
        .where({
          session_id: sessionId,
          id,
        })
        .first();

      return transactions;
    },
  );

  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies;

      const summary = await db("transactions")
        .where({ session_id: sessionId })
        .sum("amount", { as: "amount" })
        .first();

      return {
        summary,
      };
    },
  );

  app.post("/", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body,
    );

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    await db("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
