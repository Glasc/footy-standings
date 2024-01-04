import { type GetServerSideProps } from "next";
import { getSeasons } from "~/server/api/routers/seasons";

export default function Home() {
  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const seasons = await getSeasons("eng.1");
  const currentSeason = seasons.seasons[0]?.year;
  return {
    redirect: {
      destination: `/eng.1/${currentSeason}`,
      permanent: true,
    },
  };
};
