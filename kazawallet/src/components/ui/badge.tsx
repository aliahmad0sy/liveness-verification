import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default:     "bg-blue-500/10  text-blue-400   border border-blue-500/20",
        success:     "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        warning:     "bg-amber-500/10 text-amber-400  border border-amber-500/20",
        destructive: "bg-red-500/10   text-red-400    border border-red-500/20",
        secondary:   "bg-white/8      text-slate-400  border border-white/10",
        gold:        "bg-amber-500/15 text-amber-300  border border-amber-500/25",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
