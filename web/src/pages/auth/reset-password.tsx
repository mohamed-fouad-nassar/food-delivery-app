import { useNavigate, useSearchParams } from "react-router";

import { AuthHeader } from "@/layouts/auth-layout";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { useEffect } from "react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) navigate("/auth/forget-password");
  }, [token]);

  return (
    <>
      <AuthHeader
        title="Reset Your Password"
        description=" Your identity has been verified. Create a secure new password for your Savoria account."
      />
      <ResetPasswordForm token={token || ""} />
    </>
  );
}
