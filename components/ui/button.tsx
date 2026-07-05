// components/ui/button.tsx
import React, { forwardRef } from "react";
import { FiLoader } from "react-icons/fi";

export type ButtonVariant = "primary" | "outline" | "danger" | "ghost";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "ui-btn-primary",
  outline: "ui-btn-outline",
  danger: "ui-btn-danger",
  ghost: "ui-btn-ghost-muted",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", loading, children, className = "", disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={`ui-btn ${VARIANT_CLASS[variant]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <FiLoader aria-hidden className="animate-spin" size={12} />}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
