import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { membershipRouter } from "./routers/membership";
import { ledgerRouter } from "./routers/ledger";
import { bhajaneRouter } from "./routers/bhajane";
import { hallBookingRouter } from "./routers/hallbooking";
import { galleryRouter } from "./routers/gallery";
import { committeeRouter } from "./routers/committee";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  memberships : membershipRouter,
  ledger : ledgerRouter,
  bhajane : bhajaneRouter,
  hallBooking : hallBookingRouter,
  gallery: galleryRouter,
  committee : committeeRouter,
  user : userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
