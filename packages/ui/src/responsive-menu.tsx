"use client";

import * as React from "react";
import { cn } from "cn";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";
import { ButtonGroup } from "./button-group.js";
import { useIsDesktop } from "./hooks/use-is-desktop.js";
import { Sheet, SheetContent, SheetTrigger } from "./sheet.js";

export type ResponsiveMenuItem = {
  label: string;
  icon?: React.ReactNode;
  onSelect: () => void;
};

const MenuCloseContext = React.createContext(() => {});

function ResponsiveMenu({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  const [open, setOpen] = React.useState(false);

  if (isDesktop) {
    return <DropdownMenu>{children}</DropdownMenu>;
  }
  return (
    <MenuCloseContext.Provider value={() => setOpen(false)}>
      <Sheet open={open} onOpenChange={setOpen}>
        {children}
      </Sheet>
    </MenuCloseContext.Provider>
  );
}

function ResponsiveMenuTrigger({ children }: { children: React.ReactElement }) {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return <DropdownMenuTrigger data-slot="responsive-menu-trigger" render={children} />;
  }
  return <SheetTrigger asChild>{children}</SheetTrigger>;
}

function ResponsiveMenuContent({
  label,
  items,
  className,
}: {
  label?: string;
  items: ResponsiveMenuItem[];
  className?: string;
}) {
  const isDesktop = useIsDesktop();
  const close = React.useContext(MenuCloseContext);

  if (isDesktop) {
    return (
      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={8}
        className={cn("w-60", className)}
      >
        <ButtonGroup orientation="vertical" className="w-full">
          {items.map((item) => (
            <DropdownMenuItem key={item.label} onClick={item.onSelect}>
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          ))}
        </ButtonGroup>
      </DropdownMenuContent>
    );
  }
  return (
    <SheetContent side="bottom" className="max-h-[92dvh] gap-0 rounded-t-card p-0">
      <span
        aria-hidden="true"
        className="mx-auto mb-1 mt-3 block h-1 w-10 shrink-0 rounded-full bg-border"
      />
      {label && (
        <p className="shrink-0 border-b border-border px-6 py-3 font-heading text-base font-semibold tracking-tight text-gunmetal">
          {label}
        </p>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <ButtonGroup orientation="vertical" className="w-full">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onSelect();
                close();
              }}
              className="flex w-full items-center gap-2.5 rounded-input px-3 py-2.5 text-left text-sm text-gunmetal transition hover:bg-muted"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </ButtonGroup>
      </div>
    </SheetContent>
  );
}

export { ResponsiveMenu, ResponsiveMenuTrigger, ResponsiveMenuContent };
