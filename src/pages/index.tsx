import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, type FormEvent } from "react";
import { Combobox } from "~/components/combo-box";
import { columns } from "~/components/table/columns";
import { DataTable } from "~/components/table/data-table";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { type StandingColumn } from "~/shared/types";
import { api } from "~/utils/api";

const useSelectedLeague = () => {
  const [selectedLeague, setSelectedLeague] = useState<{
    name: string;
    id: `${string}.${number}` | "";
  }>({
    name: "",
    id: "",
  });
  const standings = api.standings.getStandings.useQuery();
  const leagues = api.leagues.getLeagues.useQuery();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    // if (typeof league === "string") {
    //   setSelectedLeague({
    //     name: league,
    //     id: "",
    //   });
    // }
  };

  return { selectedLeague, standings, leagues, handleSubmit };
};

export default function Home() {
  const { selectedLeague, standings, leagues, handleSubmit } =
    useSelectedLeague();
  const tableData = api.standings.getTableInfo.useQuery();
  const comboData = leagues.data?.data.map((league) => {
    return {
      value: league.name.toLowerCase(),
      label: league.name,
      id: league.id as `${string}.${number}`,
    };
  });
  if (standings.isLoading || tableData.isLoading || !comboData)
    return <div>Loading...</div>;
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-background p-8 text-foreground">
        <div className="flex grid-cols-2 gap-4 pt-6 sm:gap-2">
          <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold">{standings.data?.data.name}</h1>
            <Combobox leagues={comboData} />
          </form>
          <div className="">
            {selectedLeague
              ? (() => {
                  const rows = tableData.data?.rows ?? [];
                  return <DataTable columns={columns} data={rows} />;
                })()
              : null}
          </div>
        </div>
      </main>
    </>
  );
}
