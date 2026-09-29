import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";

import AuthLayout from "./layouts/auth-layout";
import MainLayout from "./layouts/main-layout";

import NotFound from "./pages/not-found";
const Landing = lazy(() => import("./pages/landing"));
const Login = lazy(() => import("./pages/auth/login"));
const Register = lazy(() => import("./pages/auth/register"));
const ActivateUser = lazy(() => import("@/pages/auth/activate-user"));
const ResetPassword = lazy(() => import("./pages/auth/reset-password"));
const ForgetPassword = lazy(() => import("./pages/auth/forget-password"));

import LoginSkeleton from "./skeletons/pages/login.skeleton";
import RegisterSkeleton from "./skeletons/pages/register.skeleton";
import ActivateUserSkeleton from "@/skeletons/pages/activate-user-skeleton";
import ResetPasswordSkeleton from "./skeletons/pages/reset-password.skeleton";
import ForgetPasswordSkeleton from "./skeletons/pages/forget-password.skeleton";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" />} />
        <Route
          path="login"
          element={
            <Suspense fallback={<LoginSkeleton />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="register"
          element={
            <Suspense fallback={<RegisterSkeleton />}>
              <Register />
            </Suspense>
          }
        />
        <Route
          path="reset-password"
          element={
            <Suspense fallback={<ResetPasswordSkeleton />}>
              <ResetPassword />
            </Suspense>
          }
        />
        <Route
          path="forget-password"
          element={
            <Suspense fallback={<ForgetPasswordSkeleton />}>
              <ForgetPassword />
            </Suspense>
          }
        />
        <Route
          path="user-activation"
          element={
            <Suspense fallback={<ActivateUserSkeleton />}>
              <ActivateUser />
            </Suspense>
          }
        />
      </Route>

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Landing />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
