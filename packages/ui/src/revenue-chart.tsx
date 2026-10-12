"use client";

import * as React from "react";
import { barY, defineChart } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";

export type RevenueDatum = {
  label: string;
  value: number;
};

const JUNGLE = "oklch(0.6324 0.1518 142.15)";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function RevenueChart({
  data,
  ariaLabel = "Receita por dia",
  height = 220,
}: {
  data: readonly RevenueDatum[];
  ariaLabel?: string;
  height?: number;
}) {
  const definition = React.useMemo(
    () =>
      defineChart({
        marks: [
          barY(data, {
            x: "label",
            y: "value",
            fill: JUNGLE,
            radius: [8, 8, 0, 0],
            maxThickness: 40,
          }),
        ],
        scales: {
          x: {
            scale: () => scaleBand<string>().padding(0.35),
            axis: { tickLabels: { fontSize: 11 } },
          },
          y: {
            scale: scaleLinear,
            nice: true,
            grid: true,
            axis: { tickLabels: { fontSize: 11 } },
          },
        },
        tooltip: {
          use: tooltip,
          items: [
            { label: "Dia", field: "label" },
            {
              label: "Receita",
              field: "value",
              text: (point) => brl.format(point.datum.value),
            },
          ],
        },
      }),
    [data]
  );

  return (
    <div className="min-w-0 text-pine">
      <style>{`.ts-chart-tooltip__row{grid-template-columns:minmax(0,1fr) auto !important;}.ts-chart-tooltip__row>span:first-child:empty{display:none;}.ts-chart-tooltip__row>span:last-child{font-weight:400;}`}</style>
      <Chart definition={definition} height={height} ariaLabel={ariaLabel} />
    </div>
  );
}

export { RevenueChart };
