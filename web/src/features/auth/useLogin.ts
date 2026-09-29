import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getAxiosErrorMsg } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { loginApi } from "@/features/auth/api";
import { QUERY_KEYS } from "@/lib/react-query";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      queryClient.setQueryData(QUERY_KEYS.user, res.data);
      toast.add({ type: "success", description: res.message });
      // @TODO: add navigation to target based on the user role in the response
      navigate("/");
    },
    onError: (err: unknown) => {
      const message = getAxiosErrorMsg(err);
      toast.add({ type: "error", description: message });
    },
  });

  return { login, isPending };
}
