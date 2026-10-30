"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, UploadSimple } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminShell } from "@/components/admin-shell";
import {
  ClientDetailDrawer,
  NewClientDrawer,
} from "@/components/admin/client-drawer";
import { ClientTable } from "@/components/admin/client-table";
import { useAdmin } from "@/context/admin";
import { useClients } from "@/context/clients";
import type { Client } from "@/data/clients";

export default function AdminClientsPage() {
  const { orders } = useAdmin();
  const { clients, addClient } = useClients();
  const [selected, setSelected] = useState<Client | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <AdminShell active="Clientes" title="Clientes">
      <AdminPageHeader
        actions={
          <>
            <button
              type="button"
              onClick={() => setCreating(true)}
              data-helper="admin-cliente-novo"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum transition hover:bg-primary-hover"
            >
              <Plus size={16} weight="bold" />
              Novo cliente
            </button>
            <Link
              href="/admin/integracao"
              data-helper="admin-cliente-importar"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-button border border-border px-4 py-2 text-sm font-medium text-gunmetal transition hover:border-jungle"
            >
              <UploadSimple size={16} />
              Importar via planilha
            </Link>
          </>
        }
      />

      <div className="mt-10 min-w-0">
        <ClientTable
          clients={clients}
          orders={orders}
          onOpen={setSelected}
        />
      </div>

      <ClientDetailDrawer
        client={selected}
        orders={orders}
        onClose={() => setSelected(null)}
      />
      <NewClientDrawer
        open={creating}
        onClose={() => setCreating(false)}
        onSave={addClient}
      />
    </AdminShell>
  );
}
