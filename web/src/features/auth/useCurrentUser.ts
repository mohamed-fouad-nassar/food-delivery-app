import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/react-query";
import type { CurrentUser } from "@/features/auth/types";

export function useCurrentUser() {
  const { data, isLoading } = useQuery<CurrentUser>({
    queryKey: QUERY_KEYS.user,
    enabled: false,
  });

  return { data, isLoading };
}
