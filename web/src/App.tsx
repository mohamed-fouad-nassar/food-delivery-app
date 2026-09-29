import { BrowserRouter } from "react-router";

import {
  queryClient,
  ReactQueryDevtools,
  localStoragePersister,
  PersistQueryClientProvider,
} from "@/lib/react-query";
import AppRouter from "./app-router";
import { Toaster } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: localStoragePersister }}
    >
      <ThemeProvider defaultTheme="dark" storageKey="food-delivery-theme">
        <BrowserRouter>
          <AppRouter />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}
