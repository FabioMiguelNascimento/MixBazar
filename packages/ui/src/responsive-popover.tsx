"use client";

import * as React from "react";
import { cn } from "cn";

import { Popover, PopoverAnchor, PopoverContent } from "./popover.js";
import { useIsDesktop } from "./hooks/use-is-desktop.js";
import { Sheet, SheetContent } from "./sheet.js";

const DesktopContext = React.createContext(false);

type ResponsivePopoverRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  anchorEl?: Element | null;
  anchorPoint?: { x: number; y: number } | null;
  children: React.ReactNode;
};

function ResponsivePopover({
  anchorEl,
  anchorPoint,
  children,
  ...props
}: ResponsivePopoverRootProps) {
  const isDesktop = useIsDesktop();
  const virtualRef = React.useRef<{
    getBoundingClientRect: () => DOMRect;
  } | null>(null);
  virtualRef.current = anchorPoint
    ? {
        getBoundingClientRect: () => new DOMRect(anchorPoint.x, anchorPoint.y),
      }
    : anchorEl
      ? { getBoundingClientRect: () => anchorEl.getBoundingClientRect() }
      : null;

  return (
    <DesktopContext.Provider value={isDesktop}>
      {isDesktop ? (
        <Popover modal={false} {...props}>
          <PopoverAnchor virtualRef={virtualRef} />
          {children}
        </Popover>
      ) : (
        <Sheet {...props}>{children}</Sheet>
      )}
    </DesktopContext.Provider>
  );
}

type ResponsivePopoverContentProps = {
  className?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

function ResponsivePopoverContent({
  className,
  children,
  showCloseButton,
  side = "bottom",
  align = "center",
  ...props
}: ResponsivePopoverContentProps) {
  const isDesktop = React.useContext(DesktopContext);
  if (isDesktop) {
    return (
      <PopoverContent
        side={side}
        align={align}
        className={cn(
          "flex max-h-[min(80dvh,40rem)] max-w-[calc(100vw-2rem)] flex-col gap-0 p-0",
          className
        )}
        {...props}
      >
        {children}
      </PopoverContent>
    );
  }
  return (
    <SheetContent
      side="bottom"
      showCloseButton={showCloseButton}
      className={cn("max-h-[92dvh] gap-0 rounded-t-card p-0", className)}
      {...props}
    >
      {children}
    </SheetContent>
  );
}

function ResponsivePopoverHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  const isDesktop = React.useContext(DesktopContext);
  return (
    <div
      data-slot="responsive-popover-header"
      className={cn("shrink-0 border-b border-border px-6 py-4", className)}
      {...props}
    >
      {!isDesktop && (
        <span aria-hidden="true" className="mx-auto mb-3 block h-1 w-10 rounded-full bg-border" />
      )}
      {children}
    </div>
  );
}

function ResponsivePopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="responsive-popover-title"
      className={cn("font-heading text-base font-semibold tracking-tight text-gunmetal", className)}
      {...props}
    />
  );
}

function ResponsivePopoverBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="responsive-popover-body"
      className={cn("grid min-h-0 flex-1 content-start gap-4 overflow-y-auto px-6 py-4", className)}
      {...props}
    />
  );
}

function ResponsivePopoverFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="responsive-popover-footer"
      className={cn(
        "flex shrink-0 flex-row justify-end gap-2 border-t border-border px-6 py-4",
        className
      )}
      {...props}
    />
  );
}

export {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverHeader,
  ResponsivePopoverTitle,
  ResponsivePopoverBody,
  ResponsivePopoverFooter,
};
