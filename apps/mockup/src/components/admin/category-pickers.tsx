"use client";

import {
  ResponsivePopover,
  ResponsivePopoverBody,
  ResponsivePopoverContent,
  ResponsivePopoverHeader,
  ResponsivePopoverTitle,
} from "@repo/ui";
import {
  ICONS,
  TINTS,
  type PickerId,
} from "@/components/admin/category-model";
import { CoverField } from "@/components/admin/cover-field";

export function CategoryPickers({
  picker,
  icon,
  tint,
  image,
  onIcon,
  onTint,
  onImage,
  onClose,
}: {
  picker: { id: PickerId; anchor: Element } | null;
  icon: string;
  tint: string;
  image: string;
  onIcon: (next: string) => void;
  onTint: (next: string) => void;
  onImage: (next: string) => void;
  onClose: () => void;
}) {
  return (
    <ResponsivePopover
      open={picker !== null}
      modal
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      anchorEl={picker?.anchor ?? null}
    >
      <ResponsivePopoverContent
        aria-label={
          picker?.id === "icon"
            ? "Escolher ícone"
            : picker?.id === "tint"
              ? "Escolher cor"
              : "Enviar capa"
        }
        className={picker?.id === "cover" ? "sm:w-80" : "sm:w-72"}
      >
        {picker?.id === "icon" && (
          <>
            <ResponsivePopoverHeader>
              <ResponsivePopoverTitle>Ícone</ResponsivePopoverTitle>
            </ResponsivePopoverHeader>
            <ResponsivePopoverBody>
              <div
                role="group"
                aria-label="Ícone"
                className="grid grid-cols-4 gap-2"
              >
                {Object.entries(ICONS).map(([key, OptionIcon]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onIcon(key);
                      onClose();
                    }}
                    aria-pressed={icon === key}
                    aria-label={key}
                    className={`flex h-11 items-center justify-center rounded-input border transition ${
                      icon === key
                        ? "border-jungle bg-muted"
                        : "border-border hover:border-jungle"
                    }`}
                  >
                    <span className={tint}>
                      <OptionIcon size={20} />
                    </span>
                  </button>
                ))}
              </div>
            </ResponsivePopoverBody>
          </>
        )}
        {picker?.id === "tint" && (
          <>
            <ResponsivePopoverHeader>
              <ResponsivePopoverTitle>Cor</ResponsivePopoverTitle>
            </ResponsivePopoverHeader>
            <ResponsivePopoverBody>
              <div
                role="group"
                aria-label="Cor"
                className="flex items-center gap-3"
              >
                {TINTS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onTint(option.value);
                      onClose();
                    }}
                    aria-pressed={tint === option.value}
                    aria-label={option.label}
                    title={option.label}
                    className={`size-8 rounded-full transition ${option.value} ${
                      tint === option.value
                        ? "ring-2 ring-jungle ring-offset-2 ring-offset-background"
                        : "hover:ring-2 hover:ring-pine/40 hover:ring-offset-2 hover:ring-offset-background"
                    }`}
                  />
                ))}
              </div>
            </ResponsivePopoverBody>
          </>
        )}
        {picker?.id === "cover" && (
          <>
            <ResponsivePopoverHeader>
              <ResponsivePopoverTitle>Capa</ResponsivePopoverTitle>
            </ResponsivePopoverHeader>
            <ResponsivePopoverBody>
              <CoverField value={image} onChange={onImage} />
            </ResponsivePopoverBody>
          </>
        )}
      </ResponsivePopoverContent>
    </ResponsivePopover>
  );
}
