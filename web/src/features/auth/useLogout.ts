import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { logoutApi } from "@/features/auth/api";
import { clearAuthSession, getAxiosErrorMsg } from "@/lib/api";

export function useLogout() {
  const navigate = useNavigate();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      clearAuthSession();
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
