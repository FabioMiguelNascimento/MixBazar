"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminShell } from "@/components/admin-shell";
import { OrderDrawer } from "@/components/admin/order-drawer";
import { OrderTable } from "@/components/admin/order-table";
import { useAdmin } from "@/context/admin";
import {
  FUNNEL_STAGES,
  NEXT_STATUS,
  ORDER_STATUS_LABEL,
  type AdminOrder,
  type OrderStatus,
} from "@/data/admin";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui";

type StageFilter = OrderStatus | "todas";

export default function AdminOrdersPage() {
  const { orders, setOrderStatus } = useAdmin();
  const [stage, setStage] = useState<StageFilter>("todas");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible =
    stage === "todas"
      ? orders
      : orders.filter((order) => order.status === stage);
  const selected = orders.find((order) => order.id === selectedId) ?? null;

  function advance(item: AdminOrder) {
    const next = NEXT_STATUS[item.status];
    if (next) setOrderStatus(item.id, next);
  }

  return (
    <AdminShell active="Pedidos" title="Pedidos">
      <AdminPageHeader />

      <Tabs
        value={stage}
        onValueChange={(next) => setStage(next as StageFilter)}
        className="mt-6 flex min-h-0 flex-col gap-0"
      >
        <TabsList
          aria-label="Etapas do pedido"
          className="max-w-full shrink-0 overflow-x-auto [&_[data-slot=tabs-trigger]]:shrink-0"
        >
          <TabsTrigger value="todas">
            Todas
            <CountBadge count={orders.length} />
          </TabsTrigger>
          {FUNNEL_STAGES.map((status) => (
            <OrderStageTrigger
              key={status}
              status={status}
              count={orders.filter((order) => order.status === status).length}
            />
          ))}
        </TabsList>

        <TabsContent value={stage} className="min-h-0 flex-1">
          <div className="mt-8 min-w-0">
            <OrderTable
              items={visible}
              onOpen={(item) => setSelectedId(item.id)}
              onAdvance={advance}
            />
          </div>
        </TabsContent>
      </Tabs>

      <OrderDrawer
        order={selected}
        onClose={() => setSelectedId(null)}
        onStatus={setOrderStatus}
      />
    </AdminShell>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span
      aria-hidden="true"
      className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-pine group-data-active:bg-jungle/15 group-data-active:text-jungle"
    >
      {count}
    </span>
  );
}

function OrderStageTrigger({
  status,
  count,
}: {
  status: OrderStatus;
  count: number;
}) {
  return (
    <TabsTrigger value={status}>
      {ORDER_STATUS_LABEL[status]}
      <CountBadge count={count} />
    </TabsTrigger>
  );
}
