import { redis } from "~/lib/redis";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export type Leagues = {
  status: boolean;
  data: {
    id: string;
    name: string;
    slug: string;
    abbr: string;
    logos: {
      light: string;
      dark: string;
    };
  }[];
};
type Result = {
  leagues: {
    status: boolean;
    data: {
      id: string;
      name: string;
      slug: string;
      abbr: string;
      logos: {
        light: string;
        dark: string;
      };
    }[];
  };
  comboData: {
    value: string;
    label: string;
    id: `${string}.${number}`;
    img_url: {
      dark: string;
      light: string;
    };
  }[];
};

const getComboData = (leagues: Leagues) => {
  const exceptions = new Set(["idn.1", "mys.1", "sgp.1", "tha.1", "uga.1"]);
  return leagues.data
    .map((league) => {
      return {
        value: league.name.toLowerCase(),
        label: league.name,
        id: league.id as `${string}.${number}`,
        img_url:
          {
            dark: league.logos?.dark,
            light: league.logos?.light,
          } ?? undefined,
      };
    })
    .filter((league) => !exceptions.has(league.id));
};

export const leaguesRouter = createTRPCRouter({
  getLeagues: publicProcedure.query(async () => {
    const cachedLeagues = await redis.get(`${process.env.REDIS_KEY}.leagues`);
    if (cachedLeagues) {
      const result = JSON.parse(cachedLeagues) as Result;
      return result;
    }
    const response = await fetch(
      "https://api-football-standings.azharimm.dev/leagues",
    );
    const leagues = (await response.json()) as Leagues;
    const result = { leagues, comboData: getComboData(leagues) };
    await redis.set(`${process.env.REDIS_KEY}.leagues`, JSON.stringify(result));
    return result;
  }),
});
