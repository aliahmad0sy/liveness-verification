import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              startIcon && "pr-10",
              endIcon && "pl-10",
              error && "border-red-500/50 focus:ring-red-500/50",
              className
            )}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
