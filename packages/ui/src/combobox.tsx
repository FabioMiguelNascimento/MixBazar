"use client";

import * as React from "react";
import { cn } from "cn";
import { CaretUpDown } from "@phosphor-icons/react/dist/ssr/CaretUpDown";
import { Check } from "@phosphor-icons/react/dist/ssr/Check";

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "./command.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

export type ComboboxOption = {
  value: string;
  label: string;
  hint?: string;
};

function Combobox({
  value,
  onChange,
  options,
  placeholder = "Selecionar",
  searchPlaceholder = "Buscar",
  emptyText = "Nenhum resultado.",
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (next: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  ariaLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className={cn(
            "flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-input border border-border bg-background px-3 text-sm text-gunmetal outline-none transition hover:border-jungle focus:border-jungle disabled:cursor-not-allowed disabled:opacity-50",
            value === "" && "text-pine/50",
            className
          )}
        >
          <span className="min-w-0 flex-1 truncate text-left">
            {selected ? selected.label : placeholder}
          </span>
          <CaretUpDown size={16} className="shrink-0 text-pine/60" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-(--radix-popover-trigger-width) p-0"
        onClick={(event) => event.stopPropagation()}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => {
                  onChange(option.value === value ? "" : option.value);
                  setOpen(false);
                }}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {option.hint && (
                  <span className="shrink-0 text-xs text-pine/70">{option.hint}</span>
                )}
                {option.value === value && <Check size={16} className="shrink-0 text-jungle" />}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
