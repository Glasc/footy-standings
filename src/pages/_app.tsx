import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "../globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export default api.withTRPC(MyApp);
