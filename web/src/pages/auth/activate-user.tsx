import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

import { Spinner } from "@/components/ui/spinner";
import { useActivateUser } from "@/features/auth/useActivateUser";

export default function ActivateUser() {
  const [searchParams] = useSearchParams();
  const [err, setErr] = useState<string | null>(null);
  const hasActivatedRef = useRef<string | null>(null);
  const { isError, isPending, activeUser, errorMessage } = useActivateUser();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setErr("No token provided");
      return;
    }

    if (hasActivatedRef.current === token) return;

    hasActivatedRef.current = token;
    activeUser(token);
  }, [activeUser, token]);

  const errorText = err ?? (isError ? errorMessage : null);

  if (errorText) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <h2 className="font-medium text-2xl text-destructive">{errorText}</h2>
        <p>Try to login again later</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 py-12">
      <Spinner className="size-5" />
      <span>
        {isPending
          ? "Wait until we log you in..."
          : "Activating your account..."}
      </span>
    </div>
  );
}
