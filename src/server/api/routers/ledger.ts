import type { TransactionType } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const ledgerRouter = createTRPCRouter({
  addLedger: protectedProcedure
    .input(
      z.object({
        date: z.string().min(1),
        TransactionType: z.enum(["incoming","outgoing"],),
        TransactionHeader: z.string().min(1),
        Amount: z.number().min(1, "Amount is required"),
        ReceiptNumber: z.number().min(1, "Receipt number is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newLedger = await ctx.db.ledger.create({
        data: {
          date: input.date ,
          TransactionType: input.TransactionType as TransactionType,
          TransactionHeader: input.TransactionHeader,
          Amount: input.Amount,
          ReceiptNumber: input.ReceiptNumber,
        },
      });

      return newLedger;
    }),
  deleteLedger: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Ledger ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.ledger.delete({
        where: { id: input.id },
      });

      return { message: "Ledger deleted successfully" };
    }),


    getAllLedger: protectedProcedure
  .input(
    z.object({
      type: z.enum(["incoming", "outgoing"]),
    })
  )
  .query(async ({ ctx, input }) => {
    return await ctx.db.ledger.findMany({
      where: { TransactionType: input.type },
      orderBy: { date: "asc" },
    });
  }),

});
