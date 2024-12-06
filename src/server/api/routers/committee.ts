import { createTRPCRouter,publicProcedure, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';

export const committeeRouter = createTRPCRouter({
  // Add Committee Core
  addCommitteeCore: protectedProcedure
    .input(
      z.object({
        Post: z.string().min(1, 'Post is required'),
        Name: z.string().min(1, 'Name is required'),
        imagePath: z.string().optional(),

      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = input.imagePath
      ? `https://utfs.io/f/${input.imagePath}`
      : 'https://utfs.io/f/SVkywvr9y613N1L2RBhQUxyAM8K5XHRoeWJzLluYbiBajrh1';
      const newCommitteeCore = await ctx.db.committeeCore.create({
        data: {
          Post: input.Post,
          photo: imageUrl,  // Use a default image if none is provided
          Name: input.Name,
        },
      });
      return newCommitteeCore;
    }),

  // Get All Committee Core
  getAllCommitteeCore: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.committeeCore.findMany();
  }),

  // Add Committee Member
  addCommitteeMember: protectedProcedure
  .input(
    z.object({
      Name: z.string().min(1, 'Name is required'),
      imagePath: z.string().optional(), // Make imagePath optional
    })
  )
  .mutation(async ({ ctx, input }) => {
    // Declare imageUrl outside of the block for correct scope
    const imageUrl = input.imagePath
      ? `https://utfs.io/f/${input.imagePath}`
      : 'https://utfs.io/f/SVkywvr9y613N1L2RBhQUxyAM8K5XHRoeWJzLluYbiBajrh1';
      const newCommitteeMember = await ctx.db.committeeMembers.create({
        data: {
          Name: input.Name,
          photo: imageUrl, // If 'Post' is meant for the image URL
        },
      });
      return newCommitteeMember;
  }),


  // Get All Committee Members
  getAllCommitteeMembers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.committeeMembers.findMany();
  }),

  // Delete Committee Core
  deleteCommitteeCore: protectedProcedure
    .input(z.object({ id: z.number().min(1, 'ID is required') }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.committeeCore.delete({
        where: { id: input.id },
      });
      return { message: 'Committee Core deleted successfully' };
    }),

  // Delete Committee Member
  deleteCommitteeMember: protectedProcedure
    .input(z.object({ id: z.number().min(1, 'ID is required') }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.committeeMembers.delete({
        where: { id: input.id },
      });
      return { message: 'Committee Member deleted successfully' };
    }),

    updateCommitteeCore: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, 'ID is required'),
        Post: z.string().min(1, 'Post is required'),
        Name: z.string().min(1, 'Name is required'),

      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedCommitteeCore = await ctx.db.committeeCore.update({
        where: { id: input.id },
        data: {
          Post: input.Post,
          Name: input.Name,
        },
      });
      return updatedCommitteeCore;
    }),
    updateCommitteeCorewithPhoto: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, 'ID is required'),
        Post: z.string().min(1, 'Post is required'),
        Name: z.string().min(1, 'Name is required'),
        imagePath: z.string().min(1, 'Image is required'),

      })
    )
    .mutation(async ({ ctx, input }) => {
      const imageUrl = `https://utfs.io/f/${input.imagePath}`;
      const updatedCommitteeCore = await ctx.db.committeeCore.update({
        where: { id: input.id },
        data: {
          Post: input.Post,
          Name: input.Name,
          photo: imageUrl,
        },
      });
      return updatedCommitteeCore;
    }),

    updateCommittee: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, 'ID is required'),
        Name: z.string().min(1, 'Name is required'),

      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedCommitteeCore = await ctx.db.committeeMembers.update({
        where: { id: input.id },
        data: {
          Name: input.Name,
        },
      });
      return updatedCommitteeCore;
    }),

    updateCommitteeWithPhoto: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, 'ID is required'),
        Name: z.string().min(1, 'Name is required'),
        Post: z.string().min(1, 'Post is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedCommitteeCore = await ctx.db.committeeMembers.update({
        where: { id: input.id },
        data: {
          Name: input.Name,
          photo: input.Post,
        },
      });
      return updatedCommitteeCore;
    }),
});
