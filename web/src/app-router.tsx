import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";

import { PATHS } from "@/paths";

import AuthLayout from "@/layouts/auth-layout";
import MainLayout from "@/layouts/main-layout";

import UserGuard from "@/guards/user-guard";
import GuestGuard from "@/guards/guest-guard";

import NotFound from "@/pages/not-found";
const Landing = lazy(() => import("@/pages/landing"));
const Login = lazy(() => import("@/pages/auth/login"));
const Register = lazy(() => import("@/pages/auth/register"));
const ActivateUser = lazy(() => import("@/pages/auth/activate-user"));
const ResetPassword = lazy(() => import("@/pages/auth/reset-password"));
const ForgetPassword = lazy(() => import("@/pages/auth/forget-password"));

import LoginSkeleton from "@/skeletons/pages/login.skeleton";
import RegisterSkeleton from "@/skeletons/pages/register.skeleton";
import ActivateUserSkeleton from "@/skeletons/pages/activate-user-skeleton";
import ResetPasswordSkeleton from "@/skeletons/pages/reset-password.skeleton";
import ForgetPasswordSkeleton from "@/skeletons/pages/forget-password.skeleton";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={PATHS.AUTH.LOGIN} replace />} />

      <Route element={<GuestGuard />}>
        <Route element={<AuthLayout />}>
          <Route
            path={PATHS.AUTH.LOGIN}
            element={
              <Suspense fallback={<LoginSkeleton />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path={PATHS.AUTH.REGISTER}
            element={
              <Suspense fallback={<RegisterSkeleton />}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path={PATHS.AUTH.RESET_PASSWORD}
            element={
              <Suspense fallback={<ResetPasswordSkeleton />}>
                <ResetPassword />
              </Suspense>
            }
          />
          <Route
            path={PATHS.AUTH.FORGET_PASSWORD}
            element={
              <Suspense fallback={<ForgetPasswordSkeleton />}>
                <ForgetPassword />
              </Suspense>
            }
          />
          <Route
            path={PATHS.AUTH.USER_ACTIVATION}
            element={
              <Suspense fallback={<ActivateUserSkeleton />}>
                <ActivateUser />
              </Suspense>
            }
          />
        </Route>
      </Route>

      <Route element={<UserGuard />}>
        <Route path={PATHS.APP.HOME} element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path={PATHS.APP.RESTAURANTS} element={<>RESTAURANTS PAGE</>} />
          <Route
            path={PATHS.APP.RESTAURANT_DETAILS(":id")}
            element={<>RESTAURANT DETAILS PAGE WITH ID</>}
          />
          <Route path={PATHS.APP.CONTACT} element={<>CONTACT PAGE</>} />
          <Route path={PATHS.APP.CUISINES} element={<>CUISINES PAGE</>} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
