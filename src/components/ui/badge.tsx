import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        variant === "default"
          ? "border-[color:var(--accent-ring)] bg-[var(--accent-soft)] text-[var(--accent-text)]"
          : "border-slate-700 bg-slate-800 text-slate-200",
        className,
      )}
      {...props}
    />
  );
}
