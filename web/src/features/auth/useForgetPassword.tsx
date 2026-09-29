import { useMutation } from "@tanstack/react-query";

import { getAxiosErrorMsg } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { forgetPasswordApi } from "@/features/auth/api";

export function useForgetPassword() {
  const { mutate: forgetPassword, isPending } = useMutation({
    mutationFn: forgetPasswordApi,
    onSuccess: (res) => {
      toast.add({ type: "success", description: res.message });
    },
    onError: (err: unknown) => {
      const message = getAxiosErrorMsg(err);
      toast.add({ type: "error", description: message });
    },
  });

  return { forgetPassword, isPending };
}
