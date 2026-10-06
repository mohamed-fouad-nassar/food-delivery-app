import { LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/useLogout";

export function LogoutBtn() {
  const { isPending, logout } = useLogout();

  return (
    <Button
      size="sm"
      disabled={isPending}
      variant="destructive"
      onClick={() => logout()}
      className="w-full justify-start"
    >
      <LogOutIcon />
      logout
    </Button>
  );
}
