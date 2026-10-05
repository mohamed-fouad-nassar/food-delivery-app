import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/useLogout";

export function LogoutBtn() {
  const { isPending, logout } = useLogout();

  return (
    <Button variant="destructive" disabled={isPending} onClick={() => logout()}>
      logout
    </Button>
  );
}
