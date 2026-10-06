import { Link } from "react-router";
import { HomeIcon } from "lucide-react";

import {
  Empty,
  EmptyTitle,
  EmptyHeader,
  EmptyContent,
  EmptyDescription,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

import { PATHS } from "@/paths";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="mask-b-from-20% mask-b-to-80% font-extrabold text-9xl">
            404
          </EmptyTitle>
          <EmptyDescription className="-mt-8 text-nowrap text-foreground/80">
            The page you're looking for might have been <br />
            moved or doesn't exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link to={PATHS.APP.HOME} />} nativeButton={false}>
            <HomeIcon data-icon="inline-start" />
            Go Home
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
