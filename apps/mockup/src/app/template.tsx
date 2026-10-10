"use client";

import { ViewTransition } from "react";
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="mix-page" exit="mix-page">
      {children}
    </ViewTransition>
  );
}
