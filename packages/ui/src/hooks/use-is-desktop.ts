"use client";

import * as React from "react";

export function useIsDesktop(breakpoint = 640) {
  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [breakpoint]);
  return isDesktop;
}
