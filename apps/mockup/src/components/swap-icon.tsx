"use client";

import { cn } from "cn";
import type { ReactNode } from "react";

type SwapIconProps = {
  active: boolean;
  icon: ReactNode;
  activeIcon: ReactNode;
  className?: string;
};

export function SwapIcon({ active, icon, activeIcon, className }: SwapIconProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        className,
      )}
    >
      <span
        aria-hidden={active}
        className={cn(
          "transition-all duration-200",
          active ? "scale-50 opacity-0" : "scale-100 opacity-100",
        )}
      >
        {icon}
      </span>

      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-200",
          active ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      >
        {activeIcon}
      </span>
    </span>
  );
}
