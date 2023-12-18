import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { StandingsRoot } from "~/shared/types";
import standings from "../../../mock/standings.json";

export const standingsRouter = createTRPCRouter({
  getStandings: publicProcedure.query(async ({ input }) => {
    // const response = await fetch(
    //   "https://api-football-standings.azharimm.dev/leagues/eng.1/standings?season=2023&sort=asc",
    // );
    // const standings = await response.json() as StandingsRoot
    // const standings = await response.json() as StandingsRoot
    return standings as StandingsRoot;
  }),
  getTableInfo: publicProcedure.query(async ({ input }) => {
    const rows = standings.data.standings.map((standing) => {
      const stats = standing.stats.reduce((acc, stat) => {
        return { ...acc, [stat.abbreviation]: stat.value };
      }, {});
      return { club: standing.team.displayName, ...stats };
    });

    const abbreviationExceptions = new Set(["Total", "RC", "R", "PPG", "PD"]);

    const stats = standings.data.standings[0]?.stats;

    const statsFiltered = stats?.filter((stat) => {
      return !abbreviationExceptions.has(stat.abbreviation);
    });

    const columns =
      statsFiltered?.map((stat) => {
        return {
          accessorKey: stat.abbreviation,
          header: stat.abbreviation,
        };
      }) ?? [];

    return {
      rows,
      cols: [
        {
          accessorKey: "club",
          header: "Club",
        },
        ...columns,
      ],
    };
  }),
});
