import "@/styles/globals.css";
import { loggerLink, httpBatchLink } from "@trpc/client";
import { withTRPC } from "@trpc/next";
import superjson from "superjson";
import type { AppProps } from "next/app";
import { AppRouter } from "@/server/route/app.router";
import { url } from "./constants";
import { trpc } from "@/utils/trpc";
import { UserContextProvider } from "@/context/user.context";

function App({ Component, pageProps }: AppProps) {
  const { data, error, isLoading } = trpc["me"].useQuery();

  if (isLoading) return <p>Loading...</p>;

  return (
    <UserContextProvider value={data || null}>
      <Component {...pageProps} />
    </UserContextProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const links = [
      loggerLink(),
      httpBatchLink({
        maxURLLength: 2083,
        url,
      }),
    ];

    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 60,
          },
        },
      },
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            "x-ssr": 1,
          };
        }
        return {};
      },
      links,
      transformer: superjson,
    };
  },
  ssr: false,
})(App);
