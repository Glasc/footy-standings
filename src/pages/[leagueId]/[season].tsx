import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { LeagueComboBox } from "~/components/league-combobox";
import { SeasonComboBox } from "~/components/season-combobox";
import { columns } from "~/components/table/columns";
import { DataTable } from "~/components/table/data-table";
import { Button } from "~/components/ui/button";
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
  const router = useRouter();
  const standings = useStandings(params);
  const leagues = useLeagues();
  const seasons = useSeasons(params.leagueId);
  const [leagueInput, setLeagueInput] = useState(params.season);
  const [seasonInput, setSeasonInput] = useState(params.season);
  if (standings.isLoading || leagues.isLoading) return <div>Loading...</div>;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!leagueInput || !seasonInput) return;
    await router.push(`/${seasonInput}/${leagueInput}`);
  };
  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto w-full max-w-5xl px-2">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">{standings.data?.leagueName}</h1>
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-sm items-center space-x-2"
          >
            <LeagueComboBox
              seasonInput={seasonInput}
              setSeasonInput={setSeasonInput}
              leagues={leagues.data?.comboData ?? []}
            />
            <SeasonComboBox
              leagueInput={leagueInput}
              setLeagueInput={setLeagueInput}
              seasons={seasons.data?.comboData ?? []}
            />
            <Button>Submit</Button>
          </form>
          <form className="w-full max-w-sm"></form>
        </div>
        <div className="mt-6">
          {(() => {
            return (
              <DataTable columns={columns} data={standings.data?.rows ?? []} />
            );
          })()}
        </div>
      </div>
    </main>
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
