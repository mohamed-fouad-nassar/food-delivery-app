import { LoginForm } from "@/features/auth/login-form";
import { AuthFooter, AuthHeader } from "@/layouts/auth-layout";

export default function Login() {
  return (
    <>
      <AuthHeader
        title="Login to your account"
        description="Enter your email, and password below to login to your account"
      />
      <LoginForm />
      <AuthFooter
        title="Don't have an account?"
        link={{
          path: "/auth/register",
          title: "Create new account",
        }}
      />
    </>
  );
}
