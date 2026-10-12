"use client";

import * as React from "react";
import { cn } from "cn";
import { Select as SelectPrimitive } from "radix-ui";
import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { CaretUp } from "@phosphor-icons/react/dist/ssr/CaretUp";
import { Check } from "@phosphor-icons/react/dist/ssr/Check";

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-input border border-border bg-background px-3 text-sm text-gunmetal outline-none transition hover:border-jungle focus:border-jungle disabled:cursor-not-allowed disabled:opacity-50 [&>span]:min-w-0 [&>span]:flex-1 [&>span]:truncate [&>span]:text-left",
        className
      )}
      {...props}
    >
      {children}
      <CaretDown size={16} className="shrink-0 text-pine/60" />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          "relative z-50 max-h-72 min-w-32 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-card border border-border bg-background text-gunmetal shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-input px-2 py-1.5 text-sm text-gunmetal outline-none focus:bg-muted data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.ItemIndicator className="ml-auto shrink-0">
        <Check size={16} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectItemText({ ...props }: React.ComponentProps<typeof SelectPrimitive.ItemText>) {
  return <SelectPrimitive.ItemText data-slot="select-item-text" {...props} />;
}

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectItemText };
