"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "cn";

export type ButtonVariant = "primary" | "accent" | "outline" | "outlineDark" | "text";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type IconButtonTone = "ghost" | "muted" | "solid" | "primary";

export type IconButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "justify-center rounded-button bg-jungle text-platinum hover:bg-primary-hover active:bg-primary-active",
  accent:
    "justify-center rounded-button bg-lime text-gunmetal hover:bg-secondary-hover active:bg-secondary-active",
  outline:
    "justify-center rounded-button border border-border bg-background text-gunmetal hover:bg-muted",
  outlineDark: "justify-center rounded-button border border-white/30 text-white hover:bg-white/10",
  text: "text-jungle hover:text-pine",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-4 py-2",
  sm: "px-5 py-3",
  md: "px-5 py-3.5",
  lg: "px-6 py-3.5",
  xl: "px-6 py-4",
};

const fontStyles: Record<ButtonVariant, string> = {
  primary: "text-sm font-medium",
  accent: "text-sm font-semibold",
  outline: "text-sm font-medium",
  outlineDark: "text-sm font-medium",
  text: "text-sm font-semibold",
};

const toneStyles: Record<IconButtonTone, string> = {
  ghost: "text-pine hover:bg-muted hover:text-jungle",
  muted: "text-gunmetal hover:bg-muted",
  solid: "bg-platinum/90 text-pine shadow-sm backdrop-blur hover:text-jungle",
  primary: "bg-jungle text-platinum shadow-lg hover:bg-primary-hover",
};

const iconSizeStyles: Record<IconButtonSize, string> = {
  sm: "size-8",
  md: "size-9",
  lg: "size-10",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center gap-2 transition",
    variantStyles[variant],
    variant === "text" ? undefined : sizeStyles[size],
    fontStyles[variant],
    className
  );
}

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconOnly?: false;
};

type IconOnlyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  iconOnly: true;
  icon: ReactNode;
  label: string;
  tone?: IconButtonTone;
  iconSize?: IconButtonSize;
};

export type ButtonProps = PillButtonProps | IconOnlyButtonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  if (props.iconOnly) {
    const {
      icon,
      label,
      tone = "ghost",
      iconSize = "md",
      type = "button",
      className,
      iconOnly,
      ...rest
    } = props;
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        className={cn(
          "flex items-center justify-center rounded-full transition",
          toneStyles[tone],
          iconSizeStyles[iconSize],
          className
        )}
        {...rest}
      >
        {icon}
        {props.children}
      </button>
    );
  }
  const {
    variant = "primary",
    size = "md",
    icon,
    type = "button",
    className,
    children,
    iconOnly,
    ...rest
  } = props;
  return (
    <button ref={ref} type={type} className={buttonStyles({ variant, size, className })} {...rest}>
      {icon}
      {children}
    </button>
  );
});
