import { Link } from "react-router";
import { CreditCardIcon, SettingsIcon, UserIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogoutBtn } from "@/features/auth/logout-btn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { PATHS } from "@/paths";

const userMenuLinks = [
  {
    label: "Profile",
    Icon: UserIcon,
    href: PATHS.APP.PROFILE,
  },
  {
    label: "Orders",
    Icon: CreditCardIcon,
    href: PATHS.APP.ORDERS,
  },
  {
    label: "Settings",
    Icon: SettingsIcon,
    href: PATHS.APP.SETTINGS,
  },
];

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {userMenuLinks.map(({ Icon, label, href }) => (
            <DropdownMenuItem key={href} render={<Link to={href} />}>
              <Icon />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<LogoutBtn />} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
