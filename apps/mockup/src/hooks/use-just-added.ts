"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useJustAdded(duration = 1600) {
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  const trigger = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
    }
    setJustAdded(true);
    timer.current = setTimeout(() => {
      setJustAdded(false);
    }, duration);
  }, [duration]);

  return [justAdded, trigger] as const;
}
