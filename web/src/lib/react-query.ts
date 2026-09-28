import { QueryClient } from "@tanstack/react-query";

export const QUERY_KEYS = {
  user: ["user"],
} as const;

export const queryClient = new QueryClient();
