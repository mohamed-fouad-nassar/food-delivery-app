import { Outlet } from "react-router";

import { Header } from "@/components/header";

export default function MainLayout() {
  return (
    <div className="min-h-[300vh]">
      <Header />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}
