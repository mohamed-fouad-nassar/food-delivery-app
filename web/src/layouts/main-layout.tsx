import { Outlet } from "react-router";

import { LogoutBtn } from "@/features/auth/logout-btn";

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      <header className="flex justify-end p-4">
        <LogoutBtn />
      </header>
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}
