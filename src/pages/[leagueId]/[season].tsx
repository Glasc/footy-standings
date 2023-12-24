import { type GetServerSideProps } from "next";
import { useTheme } from "next-themes";
import Image from "next/image";
import { BaseHead } from "~/components/base-head";
import { LeagueComboBox } from "~/components/league-combobox";
import { SeasonComboBox } from "~/components/season-combobox";
import { columns } from "~/components/table/columns";
import { DataTable } from "~/components/table/data-table";
import { ModeToggle } from "~/components/theme-toggle";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";

type SeasonProps = {
  leagueId: string;
  season: string;
};

const useStandings = ({ leagueId, season }: SeasonProps) => {
  const data = api.standings.getStandings.useQuery({
    leagueId: leagueId,
    season: season,
  });
  return { ...data };
};
const useLeagues = () => api.leagues.getLeagues.useQuery();
const useSeasons = (season: SeasonProps["season"]) => {
  return api.seasons.getSeasons.useQuery({ leagueId: season });
};

export default function Season(params: SeasonProps) {
  const standings = useStandings(params);
  const leagues = useLeagues();
  const seasons = useSeasons(params.leagueId);
  const currentSeasonImg = leagues.data?.comboData.find(
    (league) => league.id === params.leagueId,
  )?.img_url;
  const { theme } = useTheme();
  return (
    <>
      <BaseHead />
      <main className="min-h-screen bg-background p-4 sm:p-8">
        <div className="absolute left-8 top-8"></div>
        <div className="mx-auto w-full max-w-5xl px-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:items-center sm:flex-row space-x-0 lg:space-x-5">
              <div className="">
                {leagues.isLoading ? (
                  <Skeleton className="h-[80px] w-[80px] rounded-full" />
                ) : currentSeasonImg ? (
                  <Image
                    className="mx-auto hidden w-full max-w-[80px] rounded-lg lg:block"
                    width={80}
                    height={80}
                    alt="Current season image"
                    src={
                      theme === "dark"
                        ? currentSeasonImg?.dark
                        : currentSeasonImg?.light
                    }
                    priority
                  />
                ) : null}
              </div>
              <div className="sm:space-y-1">
                <span className="block font-semibold text-muted-foreground">
                  League:
                </span>
                {leagues.isLoading ? (
                  <>
                    <Skeleton className="h-[40px] w-[400px] rounded-full" />
                  </>
                ) : (
                  <LeagueComboBox leagues={leagues.data?.comboData ?? []} />
                )}
              </div>
              <div className="sm:space-y-1">
                <span className="block font-semibold text-muted-foreground">
                  Season:
                </span>
                {seasons.isLoading ? (
                  <>
                    <Skeleton className="h-[40px] w-[200px] rounded-full" />
                  </>
                ) : (
                  <SeasonComboBox seasons={seasons.data?.comboData ?? []} />
                )}
              </div>
            </div>
            <ModeToggle />
          </div>
          <div className="mt-3">
            {standings.isLoading ? (
              <div className="space-y-5">
                {Array.from({ length: 20 }).map(
                  (_, idx): JSX.Element => (
                    <div key={idx} className="flex items-center space-x-3">
                      <Skeleton className="h-[13px] w-full rounded-full" />
                    </div>
                  ),
                )}
              </div>
            ) : (
              <DataTable columns={columns} data={standings.data?.rows ?? []} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { leagueId, season } = context.query;
  return {
    props: {
      leagueId: leagueId ?? "2023-2024",
      season: season,
    },
  };
};
