"use client";

import { useMemo } from "react";
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  id: string;
  total: number;
  discountApplied: boolean;
}

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, Order>();

const columns = columnHelper.columns([
  columnHelper.accessor("id", { header: "Pedido" }),
  columnHelper.accessor("total", {
    header: "Total",
    cell: (info) => `R$ ${(info.getValue() / 100).toFixed(2)}`,
  }),
  columnHelper.accessor("discountApplied", {
    header: "Desconto?",
    cell: (info) => (info.getValue() ? "Sim" : "Não"),
  }),
]);

export function OrdersTable() {
  const data = useMemo<Order[]>(
    () => [
      { id: "ord_001", total: 12990, discountApplied: true },
      { id: "ord_002", total: 4590, discountApplied: false },
      { id: "ord_003", total: 8990, discountApplied: false },
    ],
    [],
  );
  const table = useTable({ features, columns, data });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos (TanStack Table + shadcn)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
