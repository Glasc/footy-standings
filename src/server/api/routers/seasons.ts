import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

type Season = {
  year: number;
};

// Extract the base URL to a constant for better maintainability
const BASE_URL = "https://api-football-standings.azharimm.dev/leagues";

export const seasonsRouter = createTRPCRouter({
  getSeasons: publicProcedure
    .input(
      z.object({
        leagueId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const response = await fetch(`${BASE_URL}/${input.leagueId}/seasons`);
      const data = (await response.json()) as {
        data: {
          seasons: Season[];
        };
      };

      const seasons = data.data.seasons?.map((season) => ({
        year: season.year,
        fullYear: `${season.year}-${Number(season.year) + 1}`,
      })) as Season[];

      const comboData = data.data.seasons?.map((season) => {
        return {
          value: season.year.toString(),
          label: `${season.year}-${Number(season.year) + 1}` as const,
        };
      });

      return { seasons, comboData };
    }),
});
