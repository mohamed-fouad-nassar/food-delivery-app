import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getAxiosErrorMsg } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { QUERY_KEYS } from "@/lib/react-query";
import { activateUserApi } from "@/features/auth/api";

export function useActivateUser() {
  const queryClient = useQueryClient();

  const {
    error,
    isError,
    isPending,
    mutate: activeUser,
  } = useMutation({
    mutationFn: activateUserApi,
    onSuccess: (res) => {
      queryClient.setQueryData(QUERY_KEYS.user, res.data);
      toast.add({ type: "success", description: res.message });
      // @TODO: add navigation to target based on the user role in the response
    },
    onError: (err: unknown) => {
      const message = getAxiosErrorMsg(err);
      toast.add({ type: "error", description: message });
    },
  });

  return {
    error,
    isError,
    isPending,
    activeUser,
    errorMessage: getAxiosErrorMsg(error),
  };
}
