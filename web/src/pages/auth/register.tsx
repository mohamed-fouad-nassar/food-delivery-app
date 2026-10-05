import { RegisterForm } from "@/features/auth/register-form";
import { AuthFooter, AuthHeader } from "@/layouts/auth-layout";

export default function Register() {
  return (
    <>
      <AuthHeader
        title="Create Your Account"
        description="Join Savoria to order curated dining from top restaurants."
      />
      <RegisterForm />
      <AuthFooter
        title="Already have an account?"
        link={{
          path: "/auth/login",
          title: "Login to you account",
        }}
      />
    </>
  );
}
