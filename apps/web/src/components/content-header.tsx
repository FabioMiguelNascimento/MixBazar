"use client";

import { useUiStore } from "@/stores/use-ui-store";

export default function ContentHeader() {
  const banner = useUiStore((s) => s.banner);
  return (
    <div className="grid gap-1 py-2">
      <h2 className="text-xl font-semibold">Visão geral</h2>
      <p className="text-muted-foreground text-sm">
        Exemplo com Zustand (banner global), TanStack Table e Charts abaixo.
      </p>
      {banner ? (
        <p className="rounded-md border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-text">
          {banner}
        </p>
      ) : null}
    </div>
  );
}
