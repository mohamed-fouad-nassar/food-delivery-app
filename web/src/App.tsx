import { BrowserRouter } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";

import AppRouter from "./app-router";
import { Toaster } from "@/components/ui/toast";
import { queryClient } from "@/lib/react-query";
import { ThemeProvider } from "@/components/theme-provider";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="food-delivery-theme">
        <BrowserRouter>
          <AppRouter />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
