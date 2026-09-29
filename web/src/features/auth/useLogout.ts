import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getAxiosErrorMsg } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { logoutApi } from "@/features/auth/api";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      queryClient.clear();
      navigate("/auth/login", { replace: true });
    },
    onSuccess: (res) => {
      toast.add({ type: "success", description: res.message });
    },
    onError: (err: unknown) => {
      const message = getAxiosErrorMsg(err);
      toast.add({ type: "error", description: message });
    },
  });

  return { logout, isPending };
}
