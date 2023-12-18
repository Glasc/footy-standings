import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type StandingsRoot } from "~/shared/types";
import standings from "../../../mock/standings.json";

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
      return {
        club: standing.team.displayName,
        club_img: standing.team.logos[0],
        ...stats,
      };
    });
    return {
      rows: rows as Row[],
    };
  }),
});
