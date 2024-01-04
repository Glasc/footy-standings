import { type GetServerSideProps } from "next";
import { getSeasons } from "~/server/api/routers/seasons";

export default function Home() {
  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    if (!params?.leagueId) {
      throw new Error("Invalid parameters");
    }

    const seasons = await getSeasons(params.leagueId as string);
    const currentSeason = seasons.seasons[0]?.year;

    return {
      redirect: {
        destination: `${params.leagueId as string}/${currentSeason}`,
        permanent: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};
