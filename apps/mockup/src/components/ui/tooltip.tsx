"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "cn";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react";

export function TooltipProvider({
  delayDuration = 0,
  ...props
}: ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

export function TooltipRoot(props: TooltipPrimitive.TooltipProps) {
  return <TooltipPrimitive.Root {...props} />;
}

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(function TooltipContent({ className, sideOffset = 6, ...props }, ref) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-button bg-jungle px-3 py-1.5 text-xs font-medium text-platinum animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

type TooltipProps = {
  content: ReactNode;
  target: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
};

export function Tooltip({
  content,
  target,
  side = "top",
  sideOffset = 6,
}: TooltipProps) {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>{target}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset}>
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
}
