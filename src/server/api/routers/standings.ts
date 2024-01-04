import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type StandingsRoot } from "~/shared/types";
import { z } from "zod";
import { redis } from "~/lib/redis";

export type Row = {
  club: string;
  club_img: {
    href: string;
    width: number;
    height: number;
    alt: string;
    rel: string[];
    lastUpdated: string;
  };
  GP: number;
  L: number;
  GD: number;
  P: number;
  A: number;
  F: number;
  D: number;
  W: number;
  PD: number;
  PPG: number;
  R: number;
  RC: number;
  Total?: number;
};

type StandingsData = {
  standings: StandingsRoot;
  rows: Row[];
  leagueName: string;
};

const getStandingsFromCache = async ({
  leagueId,
  season,
}: {
  leagueId: string;
  season: string;
}) => {
  const cachedStandings = await redis.get(
    `${process.env.REDIS_KEY}.standings.${leagueId}.${season}`,
  );
  if (cachedStandings) {
    return JSON.parse(cachedStandings) as StandingsData;
  }
};

const getStandings = async ({
  leagueId,
  season,
}: {
  leagueId: string;
  season: string;
}) => {
  try {
    const response = await fetch(
      `https://api-football-standings.azharimm.dev/leagues/${leagueId}/standings?season=${season}&sort=asc`,
    );
    const standings = (await response.json()) as StandingsRoot;
    const rows = standings?.data?.standings?.map((standing) => {
      const stats = standing?.stats.reduce((acc, stat) => {
        return { ...acc, [stat?.abbreviation]: stat?.value };
      }, {});
      const club_img = standing?.team?.logos?.[0] ?? {};
      return {
        club: standing?.team?.displayName,
        club_img,
        ...stats,
      };
    });
    return {
      standings,
      rows: rows as Row[],
      leagueName: standings.data.name,
    };
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const standingsRouter = createTRPCRouter({
  getStandings: publicProcedure
    .input(
      z.object({
        leagueId: z.string().regex(/^[\w]+\.[\d]+$/),
        season: z.string().regex(/^\d{4}/),
      }),
    )
    .query(async ({ input }) => {
      const cachedStandings = await getStandingsFromCache(input);
      if (cachedStandings) {
        return cachedStandings;
      }
      const currentYear = new Date().getFullYear();
      const standings = await getStandings(input);

      if (!standings || !("standings" in standings)) {
        return {};
      }

      const isCurrentYearRequested = currentYear !== Number(input.season);
      const key = `${process.env.REDIS_KEY}.standings.${input.leagueId}.${input.season}`;
      if (isCurrentYearRequested) {
        await redis.set(key, JSON.stringify(standings));
      } else {
        const thirtyMinutesInSeconds = 1800;
        await redis.set(
          key,
          JSON.stringify(standings),
          "EX",
          thirtyMinutesInSeconds,
        );
      }
      return standings;
    }),
});
