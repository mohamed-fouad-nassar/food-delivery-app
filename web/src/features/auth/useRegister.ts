import { useMutation } from "@tanstack/react-query";

import { getAxiosErrorMsg } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { registerApi } from "@/features/auth/api";

export function useRegister() {
  const { mutate: register, isPending } = useMutation({
    mutationFn: registerApi,
    onSuccess: (res) => {
      toast.add({ type: "success", description: res.message });
    },
    onError: (err: unknown) => {
      const message = getAxiosErrorMsg(err);
      toast.add({ type: "error", description: message });
    },
  });

  return { register, isPending };
}
