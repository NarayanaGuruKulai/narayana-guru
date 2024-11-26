import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
  getAllHallBookings: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.hallBooking.findMany();
  }),

  
  deleteHallBooking: protectedProcedure
  .input(
    z.object({
      id: z.string().min(1, "Booking ID is required"),
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db.memberships.delete({
      where: { id: input.id },
    });

    return { message: "Booking deleted successfully" };
  }),
});
