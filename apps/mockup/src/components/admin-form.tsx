import type { ReactNode } from "react";

const SPANS = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  5: "sm:col-span-5",
  6: "sm:col-span-6",
  7: "sm:col-span-7",
  8: "sm:col-span-8",
  9: "sm:col-span-9",
  10: "sm:col-span-10",
  11: "sm:col-span-11",
  12: "sm:col-span-12",
} as const;

export type FieldSpan = keyof typeof SPANS;

export function FormGrid({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`grid grid-cols-12 gap-4 ${className}`}>{children}</div>
  );
}

export function Field({
  span = 12,
  className = "",
  children,
}: {
  span?: FieldSpan;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`col-span-12 ${SPANS[span]} ${className}`}>
      {children}
    </div>
  );
}
