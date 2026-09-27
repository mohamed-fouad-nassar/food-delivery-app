import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { loginApi } from "@/features/auth/api";

export function useLogin() {
  const queryClient = useQueryClient();

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      toast.add({ type: "success", description: res.data.message });
      queryClient.setQueryData(["user"], res.data.data);
      // @TODO: add navigation to target based on the user role in the response
    },
    onError: (err) => {
      toast.add({ type: "error", description: err.message });
    },
  });

  return { login, isPending };
}
