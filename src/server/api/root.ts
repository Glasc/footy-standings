import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { clubRouter } from "./routers/club"
import { standingsRouter } from "./routers/standings";
import { leaguesRouter } from "./routers/leagues";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  standings: standingsRouter,
  leagues: leaguesRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
