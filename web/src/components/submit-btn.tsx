import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function SubmitBtn({
  title,
  pendingTitle,
  isPending = false,
}: {
  title: string;
  pendingTitle: string;
  isPending: boolean;
}) {
  return (
    <Button
      type="submit"
      disabled={isPending}
      className="flex gap-1.5 items-center justify-center"
    >
      {isPending ? (
        <>
          <Spinner />
          <span>{pendingTitle}</span>
        </>
      ) : (
        <>
          <span>{title}</span>
          <ArrowRight />
        </>
      )}
    </Button>
  );
}
