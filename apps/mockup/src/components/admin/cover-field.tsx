"use client";

import { useRef, useState } from "react";
import {
  Image as ImageIcon,
  UploadSimple,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { Input } from "@repo/ui";

const MAX_COVER_BYTES = 2 * 1024 * 1024;

export function CoverField({
  label = "Capa",
  fieldId = "cover",
  value,
  onChange,
  mode = "replace",
}: {
  label?: string;
  fieldId?: string;
  value: string;
  onChange: (next: string) => void;
  mode?: "replace" | "append";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staged, setStaged] = useState<string | null>(null);

  const shown = mode === "append" ? (staged ?? "") : value;

  function commit(next: string) {
    if (mode === "append") {
      setStaged(next === "" ? null : next);
    } else {
      onChange(next);
    }
  }

  function clear() {
    if (mode === "append") {
      setStaged(null);
    } else {
      onChange("");
    }
  }

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
      commit(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => setError("Não foi possível ler a imagem.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-2">
      <span id={`${fieldId}-label`} className="text-sm font-medium">
        {label}
      </span>
      <div
        role="button"
        tabIndex={0}
        aria-labelledby={`${fieldId}-label`}
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
        {shown.trim() !== "" ? (
          <>
            <img
              src={shown}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                clear();
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
        id={`${fieldId}-url`}
        value={shown.startsWith("data:") ? "" : shown}
        onChange={(event) => {
          setError(null);
          commit(event.target.value);
        }}
        placeholder="Ou cole a URL da imagem"
        inputMode="url"
      />
      {mode === "append" && (
        <button
          type="button"
          onClick={() => {
            if (shown.trim() === "") return;
            onChange(shown.trim());
            setStaged(null);
          }}
          disabled={shown.trim() === ""}
          className="rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Adicionar
        </button>
      )}
      {error !== null && (
        <p role="alert" className="text-xs font-medium text-danger-text">
          {error}
        </p>
      )}
    </div>
  );
}
