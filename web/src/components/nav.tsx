import { useState } from "react";
import { Link } from "react-router";
import { XIcon, MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/portal";

import { PATHS } from "@/paths";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    label: "Home",
    href: PATHS.APP.HOME,
  },
  {
    label: "Restaurants",
    href: PATHS.APP.RESTAURANTS,
  },
  {
    label: "Cuisines",
    href: PATHS.APP.CUISINES,
  },
  {
    label: "Contact",
    href: PATHS.APP.CONTACT,
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>
      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop />
          <div
            className={cn(
              "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
              "size-full p-4",
            )}
            data-slot={open ? "open" : "closed"}
          >
            <nav className="grid gap-y-2">
              {navLinks.map(({ href, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  nativeButton={false}
                  className="justify-start"
                  render={<Link to={href} />}
                >
                  {label}
                </Button>
              ))}
            </nav>
          </div>
        </Portal>
      )}
    </div>
  );
}

export function DesktopNav() {
  return (
    <nav className="hidden md:block">
      {navLinks.map(({ href, label }) => (
        <Button
          size="sm"
          key={label}
          variant="ghost"
          nativeButton={false}
          render={<Link to={href} />}
        >
          {label}
        </Button>
      ))}
    </nav>
  );
}
