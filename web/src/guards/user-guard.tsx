import { Navigate, Outlet, useLocation } from "react-router";

import { PATHS } from "@/app-router";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/features/auth/useCurrentUser";

export default function UserGuard() {
  const location = useLocation();
  const { isLoading, data } = useCurrentUser();

  if (isLoading) return <Spinner />;

  if (!data?.user)
    return (
      <Navigate to={PATHS.AUTH.LOGIN} replace state={{ from: location }} />
    );

  return <Outlet />;
}
