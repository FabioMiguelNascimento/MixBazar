"use client";

import { Eye } from "@phosphor-icons/react/dist/ssr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import type { AdminOrder } from "@/data/admin";
import { clientKey, type Client } from "@/data/clients";

function customerOrders(name: string, orders: AdminOrder[]) {
  const key = clientKey(name);

  return orders.filter((order) => clientKey(order.customer) === key);
}

export function ClientTable({
  clients,
  orders,
  onOpen,
}: {
  clients: Client[];
  orders: AdminOrder[];
  onOpen: (client: Client) => void;
}) {
  return (
    <Table aria-label="Clientes do bazar">
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Endereço</TableHead>
          <TableHead className="text-center">Pedidos</TableHead>
          <TableHead className="w-10 text-right">
            <span className="sr-only">Abrir</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => {
          const history = customerOrders(client.name, orders);

          return (
            <TableRow
              key={client.id}
              data-helper="admin-cliente-linha"
              className="cursor-default"
              onClick={() => onOpen(client)}
            >
              <TableCell className="py-3">
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-jungle/10 font-heading text-xs font-semibold text-jungle"
                  >
                    {client.name
                      .split(" ")
                      .map((part) => part[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-gunmetal">
                      {client.name}
                    </span>
                  </span>
                </span>
              </TableCell>
              <TableCell className="py-3">
                <span className="block truncate text-sm text-gunmetal">
                  {client.phone}
                </span>
                <span className="block truncate text-xs text-pine/70">
                  {client.email}
                </span>
              </TableCell>
              <TableCell className="max-w-[16rem] py-3">
                <span className="block truncate text-sm text-pine">
                  {client.address ?? "—"}
                </span>
              </TableCell>
              <TableCell className="py-3 text-center">
                <span className="font-heading text-sm font-semibold text-gunmetal">
                  {history.length}
                </span>
              </TableCell>
              <TableCell className="py-3 text-right">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpen(client);
                  }}
                  aria-label={`Ver histórico de ${client.name}`}
                  className="inline-flex size-8 items-center justify-center rounded-full text-pine transition hover:bg-muted hover:text-jungle"
                >
                  <Eye size={16} />
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
