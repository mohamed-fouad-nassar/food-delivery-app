import { useMutation } from "@tanstack/react-query";

import { getAxiosErrorMsg } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { registerApi } from "@/features/auth/api";

export function useRegister() {
  const { mutate: register, isPending } = useMutation({
    mutationFn: registerApi,
    onSuccess: (res) => {
      console.log(res);

      toast.add({
        type: "success",
        description: res.message,

        // this for development only to show mock emails
        actionProps: {
          children: "View Email",
          onClick: () => {
            window.location.replace(res.data.emailPreviewUrl);
          },
        },
      });
    },
    onError: (err: unknown) => {
      const message = getAxiosErrorMsg(err);
      toast.add({ type: "error", description: message });
    },
  });

  return { register, isPending };
}
