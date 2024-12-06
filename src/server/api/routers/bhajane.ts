import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const bhajaneRouter = createTRPCRouter({
  addBhajane: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        date: z.string().min(1, "Date is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newBhajane = await ctx.db.bhajane.create({
        data: {
          name: input.name,
          date: input.date,
        },
      });

      return newBhajane;
    }),


  deleteBhajane: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Member ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.bhajane.delete({
        where: { id: input.id },
      });

      return { message: "Bhajane deleted successfully" };
    }),


    getAllBhajane: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const bhajane = await ctx.db.bhajane.findMany({
        take: input.limit,
        orderBy: { date: "desc" },
      });

      return bhajane ?? [];
    }),
});
