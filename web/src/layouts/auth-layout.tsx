import { Link, Outlet } from "react-router";
import { CheckCircle2, ArrowUpRightFromSquare } from "lucide-react";

import Logo from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import ModeToggle from "@/components/mode-toggle";

export default function AuthLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <AuthPlaceHolder />

      <section className="max-w-5xl mx-auto w-full flex flex-col gap-4 py-4 px-6 md:px-10">
        <header className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <Logo />
          </Link>
          <ModeToggle />
        </header>
        <main className="flex flex-1 items-center justify-center">
          <div className="px-6 py-12 border rounded-2xl w-full max-w-md shadow">
            <Outlet />
          </div>
        </main>
      </section>
    </div>
  );
}

function AuthPlaceHolder() {
  return (
    <section className="relative hidden bg-muted lg:block text-white">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3l9ZRH4RWLW0KHDWwx8HGu1ZgcTJ1Dhax8nCQMufu22C6cneoC43dyGFijJb_sKQmDJI7WSVCNoeldupHjjJhckQNj-Uv68vGi3q4Ctjymb4k6n_0atVUIBQsYH0bKNcOHo2eMd5jE-6c0ZwdCJ7ZyenqFn9XrLpOiujQsSs5wOYlKR3h8H97jAZDsuobNoCIV9Sz4CNn4ZWp8kaNgKaiqjmIliRvQ3VBcJocc4IvM_z7jwlI1UgKnQ"
        alt="Image"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="absolute inset-0 bg-black/70"></span>

      <div className="relative z-10 h-full flex flex-col gap-4 p-6 md:p-10 justify-between">
        <div className="w-fit rounded-3xl p-2 bg-white dark:bg-black">
          <Logo className="max-w-34" />
        </div>

        <div className="flex flex-col gap-6">
          <Badge className="text-base p-3">CURATED DINNING EXPERIENCE</Badge>
          <h2 className="text-5xl font-medium leading-14">
            Unlock exclusive tables, private chef pop-ups, and tasting menus at
            your residence.
          </h2>
          <ul>
            <li className="mb-4 flex gap-4 items-center justify-start">
              <CheckCircle2 size={30} className="fill-primary" />
              <div>
                <h3 className="text-white font-medium">
                  Priority reservations & sommelier pairings.
                </h3>
                <p className="text-white/70">
                  Direct concierge allocation at partner 2 & 3-star Michelin
                  sanctuaries.
                </p>
              </div>
            </li>
            <li className="mb-4 flex gap-4 items-center justify-start">
              <CheckCircle2 size={30} className="fill-primary" />
              <div>
                <h3 className="text-white font-medium">
                  Dedicated white-glove culinary courier delivery.
                </h3>
                <p className="text-white/70">
                  Temperature-calibrated climate trunks safeguarding plating
                  integrity.
                </p>
              </div>
            </li>
            <li className="mb-4 flex gap-4 items-center justify-start">
              <CheckCircle2 size={30} className="fill-primary" />
              <div>
                <h3 className="text-white font-medium">
                  Tailored dietary preferences & allergy tracking.
                </h3>
                <p className="text-white/70">
                  Pre-cleared ingredients catalogued directly with kitchen
                  brigade chefs.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2 justify-center pt-4 border-t border-white/20">
          <p>Created With 🧡 By</p>
          <a
            target="_blank"
            className="flex items-center gap-1"
            href="https://mohamed-fouad-nassar.vercel.app/"
          >
            Mohamed Nassar <ArrowUpRightFromSquare size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function AuthHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 flex flex-col items-center gap-1 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-balance text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function AuthFooter({
  title,
  link,
}: {
  title: string;
  link: { path: string; title: string };
}) {
  return (
    <div className="pt-6 text-sm flex gap-2 justify-center items-center">
      <p className="text-muted-foreground">{title}</p>
      <Link to={link.path} className="hover:underline">
        {link.title}
      </Link>
    </div>
  );
}
