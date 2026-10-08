import { Suspense } from "react";
import ContentHeader from "@/components/content-header";
import { DiscountForm } from "@/components/discount-form";
import { OrdersTable } from "@/components/orders-table";
import PageHeader from "@/components/page-header/page-header";
import { SalesChart } from "@/components/sales-chart";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
  return (
    <TooltipProvider delay={300}>
      <main className="grid min-h-svh grid-rows-[auto_1fr] bg-background">
        <Suspense>
          <PageHeader />
        </Suspense>
        <section className="grid gap-6 bg-background px-4 py-6 lg:grid-cols-[1fr_1fr]">
          <div className="grid content-start gap-2">
            <ContentHeader />
            <DiscountForm />
          </div>
          <div className="grid content-start gap-6">
            <OrdersTable />
            <SalesChart />
          </div>
        </section>
      </main>
    </TooltipProvider>
  );
}
