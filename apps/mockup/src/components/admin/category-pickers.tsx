"use client";

import { useRef, useState } from "react";
import {
  Image as ImageIcon,
  UploadSimple,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { Input } from "@repo/ui";
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

const MAX_COVER_BYTES = 2 * 1024 * 1024;

function CoverField({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Envie um arquivo de imagem.");
      return;
    }
    if (file.size > MAX_COVER_BYTES) {
      setError("A imagem precisa ter até 2 MB.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () =>
      onChange(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => setError("Não foi possível ler a imagem.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-2">
      <span id="category-cover-label" className="text-sm font-medium">
        Capa
      </span>
      <div
        role="button"
        tabIndex={0}
        aria-labelledby="category-cover-label"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className={`relative flex min-h-28 w-full cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-input border border-dashed px-4 py-6 text-center transition ${
          dragging
            ? "border-jungle bg-jungle/5"
            : "border-border hover:border-jungle"
        }`}
      >
        {value.trim() !== "" ? (
          <>
            <img
              src={value}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onChange("");
              }}
              aria-label="Remover capa"
              className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-gunmetal/60 text-platinum transition hover:bg-gunmetal/80"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <span className="flex size-10 items-center justify-center rounded-full bg-platinum text-pine">
              {dragging ? <UploadSimple size={20} /> : <ImageIcon size={20} />}
            </span>
            <span className="text-sm font-medium text-gunmetal">
              Arraste a imagem ou clique para escolher
            </span>
            <span className="text-xs text-pine/70">
              PNG, JPG ou SVG até 2 MB
            </span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <Input
        id="category-cover-url"
        value={value.startsWith("data:") ? "" : value}
        onChange={(event) => {
          setError(null);
          onChange(event.target.value);
        }}
        placeholder="Ou cole a URL da imagem"
        inputMode="url"
      />
      {error !== null && (
        <p role="alert" className="text-xs font-medium text-danger-text">
          {error}
        </p>
      )}
    </div>
  );
}

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
