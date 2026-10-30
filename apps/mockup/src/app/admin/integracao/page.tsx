"use client";

import { useMemo, useState } from "react";
import {
  ArrowsClockwise,
  CheckCircle,
  UploadSimple,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminShell } from "@/components/admin-shell";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import {
  conciliateClientes,
  conciliateProdutos,
  gridToProductRows,
  gridToSheetRows,
  parseSheetText,
  sampleSheetRows,
  TARGET_LABEL,
  type IntegrationTarget,
  type ProductConciliation,
  type ClientConciliation,
} from "@/components/admin/integration-model";
import { formatBRL } from "@/components/admin/product-model";
import { useCatalog } from "@/context/catalog";
import { useClients } from "@/context/clients";
import type { Client } from "@/data/clients";

type Step = "planilha" | "conciliar" | "pronto";

type HistoryEntry = {
  id: number;
  target: IntegrationTarget;
  source: string;
  created: number;
  updated: number;
  ignored: number;
};

let HISTORY_SEQ = 1;

export default function AdminIntegrationPage() {
  const { clients, applyClientes } = useClients();
  const { products, applyProdutos } = useCatalog();

  const [target, setTarget] = useState<IntegrationTarget>("clientes");
  const [source, setSource] = useState("");
  const [grid, setGrid] = useState<string[][] | null>(null);
  const [step, setStep] = useState<Step>("planilha");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const sheetRows = useMemo(
    () => (grid === null ? [] : gridToSheetRows(grid)),
    [grid],
  );
  const productRows = useMemo(
    () => (grid === null ? [] : gridToProductRows(grid)),
    [grid],
  );

  const clientReport = useMemo<ClientConciliation>(
    () => conciliateClientes(clients, sheetRows),
    [clients, sheetRows],
  );
  const productReport = useMemo<ProductConciliation>(
    () => conciliateProdutos(products, productRows),
    [products, productRows],
  );

  const report = target === "clientes" ? clientReport : productReport;
  const newCount = report.create.length;
  const updatedCount = report.update.length;
  const errorCount = report.errors.length;

  function reset() {
    setGrid(null);
    setSource("");
    setStep("planilha");
  }

  function loadGrid(next: string[][], origin: string) {
    setGrid(next);
    setSource(origin);
    setStep("conciliar");
  }

  async function readFile(file: File) {
    const text = await file.text();
    loadGrid(parseSheetText(text), file.name);
  }

  function conciliate() {
    if (target === "clientes") {
      applyClientes(
        clientReport.create,
        clientReport.update.map((update) => ({
          id: update.id,
          patch: update.patch,
        })),
      );
    } else {
      applyProdutos(
        productReport.create,
        productReport.update.map((update) => ({
          id: update.id,
          patch: update.patch,
        })),
      );
    }

    setHistory((prev) => [
      {
        id: HISTORY_SEQ++,
        target,
        source,
        created: newCount,
        updated: updatedCount,
        ignored: errorCount,
      },
      ...prev,
    ]);
    setStep("pronto");
  }

  return (
    <AdminShell active="ConnectPlug" title="ConnectPlug">
      <AdminPageHeader
        actions={
          step === "planilha" ? undefined : (
            <button
              type="button"
              onClick={reset}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-button border border-border px-4 py-2 text-sm font-medium text-gunmetal transition hover:border-jungle"
            >
              <ArrowsClockwise size={16} />
              Nova conciliação
            </button>
          )
        }
      />

      <div className="mt-10 grid min-w-0 gap-6">
        <Tabs
          value={target}
          onValueChange={(next) => {
            setTarget(next as IntegrationTarget);
            reset();
          }}
        >
          <TabsList className="w-fit">
            {(Object.keys(TARGET_LABEL) as IntegrationTarget[]).map((opt) => (
              <TabsTrigger key={opt} value={opt}>
                {TARGET_LABEL[opt]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {step === "planilha" && (
          <section className="rounded-card border border-border bg-background px-6 py-6">
            <label
              htmlFor="integration-file"
              data-helper="integrar-enviar"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-card border border-dashed border-border px-6 py-10 text-center transition hover:border-jungle"
            >
              <UploadSimple size={28} className="text-jungle" />
              <span className="font-heading text-sm font-semibold text-gunmetal">
                Envie a planilha de {TARGET_LABEL[target].toLowerCase()}
              </span>
              <span className="text-xs text-pine/70">
                Arraste o arquivo aqui ou toque para escolher — CSV ou
                separado por tabulação e ponto e vírgula
              </span>
              <input
                id="integration-file"
                type="file"
                accept=".csv,.tsv,.txt"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file !== undefined) void readFile(file);
                  event.target.value = "";
                }}
              />
            </label>

            <div className="my-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-pine/70">ou</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                data-helper="integrar-demo"
                onClick={() =>
                  loadGrid(
                    sampleSheetRows(target),
                    `demonstração-${target}`,
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover"
              >
                <ArrowsClockwise size={16} weight="bold" />
                Usar planilha de demonstração
              </button>
            </div>
          </section>
        )}

        {step !== "planilha" && grid !== null && (
          <section className="rounded-card border border-border bg-background px-6 py-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-heading text-sm font-semibold text-gunmetal">
                  {source}
                </p>
                <p className="text-xs text-pine/70">
                  {grid.length - 1} linha(s) detectadas · colunas:{" "}
                  {grid[0]?.join(", ")}
                </p>
              </div>
            </header>

            <SheetPreview grid={grid} target={target} />
          </section>
        )}

        {step === "conciliar" && (
          <section className="rounded-card border border-border bg-background px-6 py-6">
            <header className="flex min-w-0 flex-wrap items-center justify-between gap-3">
              <p className="font-heading text-sm font-semibold text-gunmetal">
                Conciliação com o sistema
              </p>
              <span className="grid grid-cols-3 gap-3 text-center text-xs">
                <span className="grid gap-0.5">
                  <span className="font-heading text-base font-semibold text-gunmetal">
                    {newCount}
                  </span>
                  <span className="text-pine/70">novos</span>
                </span>
                <span className="grid gap-0.5">
                  <span className="font-heading text-base font-semibold text-gunmetal">
                    {updatedCount}
                  </span>
                  <span className="text-pine/70">atualizados</span>
                </span>
                <span className="grid gap-0.5">
                  <span
                    className={`font-heading text-base font-semibold ${errorCount > 0 ? "text-danger" : "text-gunmetal"}`}
                  >
                    {errorCount}
                  </span>
                  <span className="text-pine/70">inválidos</span>
                </span>
              </span>
            </header>

            <ul className="mt-4 grid gap-2">
              {report.create.map((row) => (
                <li
                  key={`novo-${"email" in row ? row.email : row.name}`}
                  className="flex items-center gap-2.5 text-sm"
                >
                  <span className="rounded-full bg-lime px-2.5 py-1 text-[11px] font-semibold text-gunmetal">
                    novo
                  </span>
                  <span className="min-w-0 flex-1 truncate text-gunmetal">
                    {row.name}
                  </span>
                  {"email" in row && (
                    <span className="hidden truncate text-xs text-pine/70 sm:block">
                      {row.email}
                    </span>
                  )}
                </li>
              ))}
              {report.update.map((row) => (
                <li
                  key={`atualiza-${row.id}`}
                  className="flex items-center gap-2.5 text-sm"
                >
                  <span className="rounded-full bg-jungle px-2.5 py-1 text-[11px] font-semibold text-platinum">
                    atualiza
                  </span>
                  <span className="min-w-0 flex-1 truncate text-gunmetal">
                    {row.name}
                  </span>
                  <span className="hidden truncate text-xs text-pine/70 sm:block">
                    {row.fields.join(", ")}
                  </span>
                </li>
              ))}
              {report.errors.map((row) => (
                <li key={`erro-${row.line}`} className="flex items-center gap-2.5 text-sm">
                  <WarningCircle size={20} className="shrink-0 text-warning" />
                  <span className="min-w-0 flex-1 truncate text-pine">
                    {row.text}
                  </span>
                  <span className="text-xs text-pine/70">linha {row.line}</span>
                </li>
              ))}

              {report.create.length === 0 &&
                report.update.length === 0 &&
                report.errors.length === 0 && (
                  <li className="flex items-center gap-2.5 text-sm text-pine/70">
                    <CheckCircle size={18} className="text-jungle" />
                    Planilha em par com o sistema — nada a conciliar.
                  </li>
                )}
            </ul>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                data-helper="integrar-conciliar"
                disabled={newCount === 0 && updatedCount === 0}
                onClick={conciliate}
                className="inline-flex items-center gap-1.5 rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle size={16} weight="bold" />
                Conciliar {newCount + updatedCount} registro(s)
              </button>
            </div>
          </section>
        )}

        {step === "pronto" && (
          <section className="rounded-card border border-border bg-background px-6 py-6">
            <div className="flex items-center gap-2.5">
              <CheckCircle size={20} weight="bold" className="text-jungle" />
              <p className="font-heading text-sm font-semibold text-gunmetal">
                Conciliação concluída — {newCount} novo(s), {updatedCount}{" "}
                atualizado(s).
              </p>
            </div>
            {target === "clientes" ? (
              <p className="mt-1 text-sm text-pine">
                A lista em Clientes já reflete a planilha enviada.
              </p>
            ) : (
              <p className="mt-1 text-sm text-pine">
                O catálogo em Produtos já reflete a planilha enviada.
              </p>
            )}
          </section>
        )}

        {history.length > 0 && (
          <section className="rounded-card border border-border bg-background px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pine/70">
              Histórico de conciliações
            </p>
            <ul className="mt-3 grid gap-2">
              {history.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center gap-2.5 text-sm text-gunmetal"
                >
                  <span className="min-w-0 flex-1 truncate">
                    {TARGET_LABEL[entry.target]} · {entry.source}
                  </span>
                  <span className="text-xs text-pine/70">
                    {entry.created} novo(s) · {entry.updated} atualizado(s)
                    {entry.ignored > 0 ? ` · ${entry.ignored} inválido(s)` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </AdminShell>
  );
}

function SheetPreview({
  grid,
  target,
}: {
  grid: string[][];
  target: IntegrationTarget;
}) {
  const headers = target === "clientes"
    ? ["Nome", "E-mail", "Telefone", "Endereço"]
    : ["Produto", "Categoria", "Preço", "Ativo"];

  return (
    <div className="mt-4">
      <Table aria-label={`Primeiras linhas da planilha de ${target}`}>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {grid.slice(1, 6).map((cells, index) => (
            <TableRow key={index}>
              {cells.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="py-2">
                  <span className="block max-w-[14rem] truncate text-sm text-gunmetal">
                    {cell === "" ? "—" : cell}
                  </span>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
