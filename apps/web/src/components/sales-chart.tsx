"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/**
 * TanStack não tem lib de charts — usamos Recharts dentro do
 * ChartContainer do shadcn (padrão oficial do shadcn Chart).
 */
const data = [
  { month: "Jan", sales: 4000 },
  { month: "Fev", sales: 3000 },
  { month: "Mar", sales: 5200 },
  { month: "Abr", sales: 4800 },
];

const chartConfig = {
  sales: { label: "Vendas", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas por mês</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-56 w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
