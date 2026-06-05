"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, success, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-card-light border border-border rounded-xl px-4 py-3 text-text placeholder:text-muted/60",
          "transition-all duration-200",
          "focus:outline-none focus:border-accent focus:shadow-[0_0_15px_var(--color-accent-glow)]",
          error && "border-red-500 focus:border-red-500 focus:shadow-[0_0_15px_rgba(255,0,0,0.15)]",
          success && "border-green-500 focus:border-green-500 focus:shadow-[0_0_15px_rgba(0,255,0,0.1)]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
