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
  destructive?: boolean;
  keepOpen?: boolean;
  onSelect: () => void;
};

const MenuContext = React.createContext({
  isDesktop: false,
  close: () => {},
});

function ResponsiveMenu({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isDesktop = useIsDesktop();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;
  const value = React.useMemo(
    () => ({ isDesktop, close: () => setIsOpen(false) }),
    [isDesktop, setIsOpen]
  );

  if (isDesktop) {
    return (
      <MenuContext.Provider value={value}>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          {children}
        </DropdownMenu>
      </MenuContext.Provider>
    );
  }
  return (
    <MenuContext.Provider value={value}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {children}
      </Sheet>
    </MenuContext.Provider>
  );
}

function ResponsiveMenuTrigger({ children }: { children: React.ReactElement }) {
  const { isDesktop } = React.useContext(MenuContext);
  if (isDesktop) {
    return <DropdownMenuTrigger data-slot="responsive-menu-trigger" render={children} />;
  }
  return <SheetTrigger asChild>{children}</SheetTrigger>;
}

function ResponsiveMenuContent({
  label,
  items,
  children,
  className,
}: {
  label?: string;
  items: ResponsiveMenuItem[];
  children?: React.ReactNode;
  className?: string;
}) {
  const { isDesktop, close } = React.useContext(MenuContext);

  if (isDesktop) {
    return (
      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={8}
        onClick={(event) => event.stopPropagation()}
        className={cn("w-60", className)}
      >
        {children ?? (
          <ButtonGroup orientation="vertical" className="w-full">
            {items.map((item) => (
              <DropdownMenuItem
                key={item.label}
                variant={item.destructive ? "destructive" : "default"}
                closeOnClick={!item.keepOpen}
                onClick={(event) => {
                  event.stopPropagation();
                  item.onSelect();
                }}
              >
                <span className="min-w-0 flex-1 truncate text-right">{item.label}</span>
                <span className="shrink-0">{item.icon}</span>
              </DropdownMenuItem>
            ))}
          </ButtonGroup>
        )}
      </DropdownMenuContent>
    );
  }
  return (
    <SheetContent
      side="bottom"
      onClick={(event) => event.stopPropagation()}
      className="max-h-[92dvh] gap-0 rounded-t-card p-0"
    >
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
        {children ?? (
          <ButtonGroup orientation="vertical" className="w-full">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  item.onSelect();
                  if (!item.keepOpen) close();
                }}
                className={`flex w-full items-center gap-2.5 rounded-input px-3 py-2.5 text-left text-sm transition hover:bg-muted ${
                  item.destructive ? "text-danger-text" : "text-gunmetal"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
              </button>
            ))}
          </ButtonGroup>
        )}
      </div>
    </SheetContent>
  );
}

export { ResponsiveMenu, ResponsiveMenuTrigger, ResponsiveMenuContent };
