import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "outline";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  default:
    "bg-amber-400 text-slate-950 hover:bg-amber-300 disabled:bg-slate-700 disabled:text-slate-400",
  secondary:
    "bg-slate-800 text-slate-100 hover:bg-slate-700 disabled:bg-slate-800 disabled:text-slate-500",
  outline:
    "border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800/60 disabled:border-slate-800 disabled:text-slate-500",
};

export function buttonVariants(variant: ButtonVariant = "default", className?: string) {
  return cn(
    "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-2xl px-4 text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60",
    "disabled:cursor-not-allowed",
    variants[variant],
    className,
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <button ref={ref} className={buttonVariants(variant, className)} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
