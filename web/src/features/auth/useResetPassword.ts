import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { getAxiosErrorMsg } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { resetPasswordApi } from "@/features/auth/api";
import type { ResetPasswordFormValues } from "@/features/auth/types";

export function useResetPassword() {
  const navigate = useNavigate();

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: ({
      data,
      token,
    }: {
      data: ResetPasswordFormValues;
      token: string;
    }) => resetPasswordApi(data, token),
    onSuccess: (res) => {
      toast.add({ type: "success", description: res.message });
      navigate("/auth/login", { replace: true });
    },
    onError: (err: unknown) => {
      const message = getAxiosErrorMsg(err);
      toast.add({ type: "error", description: message });
    },
  });

  return { resetPassword, isPending };
}
