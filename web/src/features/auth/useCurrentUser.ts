import { useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/react-query";
import { getCurrentUserApi } from "@/features/auth/api";
import type { LoginSuccessResponse } from "@/features/auth/types";

export function useCurrentUser() {
  const queryClient = useQueryClient();
  const queryData = queryClient.getQueryData<LoginSuccessResponse>(
    QUERY_KEYS.user,
  );
  const token = queryData?.data?.token;

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.user,
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await getCurrentUserApi();
      return {
        user: res.data?.user,
        token: token,
      };
    },
  });

  return { data, isLoading };
}
