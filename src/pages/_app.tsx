import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "../globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/components/theme-provider";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Component {...pageProps} />
        {process.env.ENV === "DEV" && <ReactQueryDevtools />}
      </ThemeProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
