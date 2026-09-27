import { LoginForm } from "@/features/auth/login-form";
import { AuthFooter, AuthHeader } from "@/layouts/auth-layout";

export default function Login() {
  return (
    <>
      <AuthHeader
        title="Welcome Back"
        description="Login to savor culinary excellence delivered to your door."
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
