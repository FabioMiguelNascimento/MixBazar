"use client";

import Link from "next/link";
import { ChartLine } from "@phosphor-icons/react";
import { useQueryState } from "nuqs";

export default function PageHeader() {
  const [tab, setTab] = useQueryState("tab", { defaultValue: "overview" });

  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2.5">
        <ChartLine size={22} weight="duotone" aria-hidden />
        <div>
          <h1 className="text-lg font-semibold">TCC Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Turborepo · Next.js + NestJS · aba via nuqs: {tab}
        </p>
        </div>
      </div>
      <nav className="flex items-center gap-2">
        {(["overview", "orders", "discounts"] as const).map((t) => (
          <button
            key={t}
            onClick={() => void setTab(t)}
            className={`rounded-md px-3 py-1.5 text-sm capitalize ${
              tab === t ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
        <Link
          href="/ui"
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
        >
          UI
        </Link>
      </nav>
    </header>
  );
}
