import { type GetServerSideProps } from "next";

export default function Home() {
  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const currentYear = new Date().getFullYear();
  return {
    redirect: {
      destination: `/eng.1/${currentYear}`,
      permanent: true,
    },
  };
};
