import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const galleryRouter = createTRPCRouter({
  // Add a new image to the gallery
  addImage: protectedProcedure
    .input(
      z.object({
        imagePath: z.string().min(1, "Image URL is required"), // URL of the image
        uploadDate: z.string().optional(), // Optional upload date (if not provided, set it to today's date)
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Default to today's date if no date is provided
      const uploadDate = input.uploadDate ?? new Date().toISOString();
      const imageUrl = `https://utfs.io/f/${input.imagePath}`;
      // Create a new gallery entry
      const newImage = await ctx.db.gallery.create({
        data: {
          imagePath: imageUrl,
          uploadDate: new Date(uploadDate), // Ensure the date is in the correct format
        },
      });

      return newImage;
    }),

  // Get all gallery images
  getAllGallery: publicProcedure.query(async ({ ctx }) => {
    const gallery = await ctx.db.gallery.findMany();
    return gallery ?? [];
  }),

  getAllGalleryList: publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).default(10),
    })
  )
  .query(async ({ ctx, input }) => {
    return await ctx.db.gallery.findMany({
      orderBy: { uploadDate: "desc" },
      take: input.limit,
    });
  }),


  // Optional: Delete an image from the gallery
  deleteImage: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "Image ID is required"), // ID of the image to delete
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.gallery.delete({
        where: { id: input.id },
      });

      return { message: "Image deleted successfully" };
    }),
});
