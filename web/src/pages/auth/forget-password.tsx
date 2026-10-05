import { AuthFooter, AuthHeader } from "@/layouts/auth-layout";
import { ForgetPasswordForm } from "@/features/auth/forget-password-form";

export default function ForgetPassword() {
  return (
    <>
      <AuthHeader
        title="Account Recovery"
        description="Enter your registered email address. We will send you a link to reset your password."
      />
      <ForgetPasswordForm />
      <AuthFooter
        title="Remember your password?"
        link={{
          path: "/auth/login",
          title: "Back to login",
        }}
      />
    </>
  );
}
