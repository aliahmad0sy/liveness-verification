import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, prefix, suffix, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
      <div className="relative">
        {prefix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{prefix}</span>}
        <input
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-slate-500",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            prefix && "pr-10",
            suffix && "pl-10",
            error && "border-red-500/50 focus:ring-red-500/30",
            className
          )}
          {...props}
        />
        {suffix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{suffix}</span>}
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
);
Input.displayName = "Input";
