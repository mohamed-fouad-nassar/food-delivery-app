import { Outlet, Navigate } from "react-router";

import { PATHS } from "@/paths";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/features/auth/useCurrentUser";

export default function GuestGuard() {
  const { isLoading, data } = useCurrentUser();

  if (isLoading) return <Spinner />;
  if (data?.user) return <Navigate to={PATHS.APP.HOME} />;

  return <Outlet />;
}
