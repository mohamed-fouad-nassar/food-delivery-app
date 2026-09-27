import { cn } from "cn";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("max-w-44", className)}>
      <img
        src="/logo-dark.png"
        alt="logo-dark"
        className="hidden dark:block max-w-full"
      />
      <img
        src="/logo-light.png"
        alt="logo-light"
        className="dark:hidden block max-w-full"
      />
    </div>
  );
}
