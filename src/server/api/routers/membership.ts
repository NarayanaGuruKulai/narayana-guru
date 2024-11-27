import type { MemType } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const membershipRouter = createTRPCRouter({
  addMember: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        address: z.string().optional(),
        date: z.string().optional(),
        type: z.enum(["ajeeva","poshaka","mrutha"],),
        photo: z.string().optional(),
        receiptno: z.number().min(1, "Receipt number is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = input.photo
        ? `https://utfs.io/f/${input.photo}`
        : "https://utfs.io/f/0yks13NtToBiMOM3L9fzWI7ScAKGqQtv4FT8wMPEHbihruCg";

      const newMember = await ctx.db.memberships.create({
        data: {
          name: input.name,
          address: input.address ?? null,
          date: input.date ?? null,
          type: input.type as MemType, // Type-cast to MemType
          photo: imageUrl,
          receiptno: input.receiptno,
        },
      });

      return newMember;
    }),

  // Delete a member
  deleteMembership: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Member ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.memberships.delete({
        where: { id: input.id },
      });

      return { message: "Member deleted successfully" };
    }),
    getAllMembers: protectedProcedure.query(async ({ ctx }) => {
      const members = await ctx.db.memberships.findMany({  
      });
      return members ?? [];
    }),
});
