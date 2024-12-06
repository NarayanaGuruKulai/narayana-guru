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
        : "https://utfs.io/f/SVkywvr9y613N1L2RBhQUxyAM8K5XHRoeWJzLluYbiBajrh1";

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

    updateMembership: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, 'ID is required'),
        Name: z.string().min(1, 'Name is required'),
        Address: z.string().min(1, 'Address is required'),
        Date: z.string().min(1, 'Date is required'),
        Type: z.enum(["ajeeva","poshaka","mrutha"],),
        ReceiptNo: z.number().min(1, 'ReceiptNo is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedMembership = await ctx.db.memberships.update({
        where: { id: input.id },
        data: {
          name: input.Name,
          address: input.Address,
          date: input.Date,
          type: input.Type,
          receiptno: input.ReceiptNo
        },
      });
      return updatedMembership;
    }),

    updateMembershipwithPhoto: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, 'ID is required'),
        Name: z.string().min(1, 'Name is required'),
        Address: z.string().min(1, 'Address is required'),
        Date: z.string().min(1, 'Date is required'),
        Type: z.enum(["ajeeva","poshaka","mrutha"],),
        ReceiptNo: z.number().min(1, 'ReceiptNo is required'),
        ImagePath: z.string().min(1, 'ImagePath is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = `https://utfs.io/f/${input.ImagePath}`;
      const updatedMembership = await ctx.db.memberships.update({
        where: { id: input.id },
        data: {
          name: input.Name,
          address: input.Address,
          date: input.Date,
          type: input.Type,
          receiptno: input.ReceiptNo,
          photo: imageUrl
        },
      });
      return updatedMembership;
    }),
});
