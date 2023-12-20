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

export const standingsRouter = createTRPCRouter({
  getStandings: publicProcedure
    .input(
      z.object({
        leagueId: z.string().regex(/^[\w]+\.[\d]+$/),
        season: z.string().regex(/^\d{4}/),
      }),
    )
    .query(async ({ input }) => {
      const cachedStandings = await redis.get(
        `${process.env.REDIS_KEY}.standings.${input.leagueId}.${input.season}`,
      );
      const currentYear = new Date().getFullYear();
      if (cachedStandings) {
        return JSON.parse(cachedStandings) as StandingsData;
      }
      const response = await fetch(
        `https://api-football-standings.azharimm.dev/leagues/${input.leagueId}/standings?season=${input.season}&sort=asc`,
      );
      const standings = (await response.json()) as StandingsRoot;
      const rows = standings.data.standings.map((standing) => {
        const stats = standing.stats.reduce((acc, stat) => {
          return { ...acc, [stat.abbreviation]: stat.value };
        }, {});
        return {
          club: standing.team.displayName,
          club_img: standing.team.logos[0],
          ...stats,
        };
      });
      const result = {
        standings,
        rows: rows as Row[],
        leagueName: standings.data.name,
      };
      if (currentYear !== Number(input.season)) {
        await redis.set(
          `${process.env.REDIS_KEY}.standings.${input.leagueId}.${input.season}`,
          JSON.stringify(result),
        );
      } else {
        const thirtyMinutesInSeconds = 1800;
        await redis.set(
          `${process.env.REDIS_KEY}.standings.${input.leagueId}.${input.season}`,
          JSON.stringify(result),
          "EX",
          thirtyMinutesInSeconds,
        );
      }
      return result;
    }),
});
