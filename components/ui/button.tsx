"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover shadow-[0_0_20px_var(--color-accent-glow)] hover:shadow-[0_0_30px_var(--color-accent-glow)]",
  secondary:
    "bg-card border border-border text-text hover:bg-card-light hover:border-text/20",
  ghost:
    "text-muted hover:text-text hover:bg-card",
  icon:
    "text-muted hover:text-text hover:bg-card p-2 rounded-lg",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent",
          variantStyles[variant],
          sizeStyles[size],
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
