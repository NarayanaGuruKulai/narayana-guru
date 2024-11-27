import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const hallBookingRouter = createTRPCRouter({
  addHallBooking: protectedProcedure
    .input(
      z.object({
        BookingDate: z.string(),
        BookingType: z.enum(["marriagereceptionengagement", "lastrites", "other"]),
        BookingNote: z.string(),
        FromTime: z.string(),
        ToTime: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const hallBooking = await ctx.db.hallBooking.create({
        data: {
          BookingDate: input.BookingDate,
          BookingType: input.BookingType,
          BookingNote: input.BookingNote,
          FromTime: input.FromTime,
          ToTime: input.ToTime,
        },
      });
      return hallBooking;
    }),
    getAllHallBookings: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.hallBooking.findMany({
        orderBy: { BookingDate: "desc" },
        take: input.limit,
      });
    }),

    getAllHallBookingsCalendar: publicProcedure.query(async ({ ctx }) => {
      const booking = await ctx.db.hallBooking.findMany();
      return booking ?? [];
    }),
  
  deleteHallBooking: protectedProcedure
  .input(
    z.object({
      id: z.number().min(1, "Booking ID is required"),
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db.hallBooking.delete({
      where: { id: input.id },
    });

    return { message: "Booking deleted successfully" };
  }),
});
