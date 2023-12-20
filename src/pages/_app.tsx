import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "../globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      {process.env.ENV === "DEV" && <ReactQueryDevtools />}
    </>
  );
};

export default api.withTRPC(MyApp);
