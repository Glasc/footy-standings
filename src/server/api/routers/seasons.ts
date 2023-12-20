import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { redis } from "~/lib/redis";

type Season = {
  year: number;
};

type ComboData = {
  value: string;
  label: `${number}-${number}`;
}[];

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
      const cachedSeasons = await redis.get(`${process.env.REDIS_KEY}.seasons`);
      if (cachedSeasons) {
        return JSON.parse(cachedSeasons) as {
          seasons: Season[];
          comboData: ComboData;
        };
      }
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
      const result = { seasons, comboData };
      const weekInSeconds = 604800;
      await redis.set(
        `${process.env.REDIS_KEY}.seasons`,
        JSON.stringify(result),
        "EX",
        weekInSeconds,
      );
      return result;
    }),
});
