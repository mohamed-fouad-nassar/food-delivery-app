import { Link } from "react-router";

import Logo from "@/components/logo";
import { UserMenu } from "@/components/user-menu";
import { DesktopNav, MobileNav } from "@/components/nav";

import { PATHS } from "@/paths";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";

export function Header() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-5xl border-transparent border-b rounded-xl md:border transition-all ease-out",
        {
          "w-[calc(100%-10px)] border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-4xl md:shadow":
            scrolled,
        },
      )}
    >
      <div
        className={cn(
          "flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
          {
            "md:px-2": scrolled,
          },
        )}
      >
        <Link
          className="block rounded-xl hover:bg-muted dark:hover:bg-muted/50"
          to={PATHS.APP.HOME}
        >
          <Logo className="w-32" />
        </Link>
        <DesktopNav />
        <div className="flex gap-2">
          <UserMenu />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
