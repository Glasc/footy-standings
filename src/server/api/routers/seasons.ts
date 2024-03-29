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

type Seasons = {
  seasons: Season[];
  comboData: ComboData;
};

const BASE_URL = "https://api-football-standings.azharimm.dev/leagues";

const getSeasonsFromCache = async () => {
  const cachedSeasons = await redis.get(`${process.env.REDIS_KEY}.seasons`);
  if (cachedSeasons) {
    return JSON.parse(cachedSeasons) as {
      seasons: Season[];
      comboData: ComboData;
    };
  }
};

const getSeasonsFromApi = async (leagueId: string) => {
  const response = await fetch(`${BASE_URL}/${leagueId}/seasons`);
  const data = (await response.json()) as {
    data: {
      seasons: Season[];
    };
  };
  const seasons = data.data.seasons;
  const seasonFormats = seasons?.map(({ year }) => {
    return {
      year,
      fullYear: `${year}-${year + 1}`,
    };
  }) as Season[];
  const comboData = seasons?.map(({ year }) => {
    return {
      value: year.toString(),
      label: `${year}-${Number(year) + 1}` as const,
    };
  });
  return { seasons: seasonFormats, comboData };
};

const saveSeasonsOnCache = async ({
  seasons,
  expiration,
}: {
  seasons: Seasons;
  expiration: number;
}) => {
  if (Object.keys(seasons).length > 0) {
    await redis.set(
      `${process.env.REDIS_KEY}.seasons`,
      JSON.stringify(seasons),
      "EX",
      expiration,
    );
  }
};

export const getSeasons = async (leagueId: string) => {
  const cachedSeasons = await getSeasonsFromCache();
  if (cachedSeasons) {
    return cachedSeasons;
  }
  const seasons = await getSeasonsFromApi(leagueId);
  const monthInSeconds = 30 * 24 * 60 * 60;
  await saveSeasonsOnCache({ seasons, expiration: monthInSeconds });
  return seasons;
};

export const seasonsRouter = createTRPCRouter({
  getSeasons: publicProcedure
    .input(
      z.object({
        leagueId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await getSeasons(input.leagueId);
    }),
});
