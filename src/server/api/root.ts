import { createTRPCRouter } from "~/server/api/trpc";
import { standingsRouter } from "./routers/standings";
import { leaguesRouter } from "./routers/leagues";
import { seasonsRouter } from "./routers/seasons";

export const appRouter = createTRPCRouter({
  standings: standingsRouter,
  leagues: leaguesRouter,
  seasons: seasonsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
