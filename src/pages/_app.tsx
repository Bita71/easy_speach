import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { StoreContext } from "storeon/react";
import "antd/dist/reset.css";
import store from "@/store";
import { useEffect } from "react";

const STALE_TIME = 300000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (!store.get().user) {
      const user = localStorage.getItem("user");
      if (user) {
        store.dispatch("set", JSON.parse(user));
      } else {
        store.dispatch("delete");
      }
    }
  }, []);
  return (
    <StoreContext.Provider value={store}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </StoreContext.Provider>
  );
}
