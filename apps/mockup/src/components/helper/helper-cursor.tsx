"use client";

import { CursorClick } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef } from "react";
import { readHelperPosition } from "@/context/helper";

/**
 * Último toque do ponteiro demonstrativo — sobrevive às remontagens
 * entre passos: o próximo voo sai daqui ("sai da última posição").
 */
let lastPointerPoint: { x: number; y: number } | null = null;

/* Voo proporcional à distância (px/ms). */
const TRAVEL_MIN_MS = 340;
const TRAVEL_MAX_MS = 680;
const TRAVEL_SPEED = 1.8;
/* Onde fica o "bico" do cursor dentro do ícone de 24px. */
const POINTER_TIP = { x: 3, y: 2 };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

/**
 * Foco do assistente: um ponteiro demonstrativo sai da posição do toque
 * anterior (ou da bolha do assistente), voa até o elemento do passo e
 * confirma com um clique — acendendo só então o véu com o recorte no
 * alvo. O clique real fica sempre com o usuário — ou com a demonstração
 * quando ele pede por "Próximo". Somente visual
 * (pointer-events: none) — cliques reais passam por baixo.
 */
export function HelperCursor({ element }: { element: Element }) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const rippleRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    const pointer = pointerRef.current;

    if (box === null || pointer === null) {
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const clickPoint = (): { x: number; y: number } => {
      const rect = element.getBoundingClientRect();

      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    };

    const writePointer = (position: { x: number; y: number }) => {
      pointer.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    };

    const arrive = () => {
      const point = clickPoint();

      arrived = true;
      lit = true;

      writePointer(point);
      lastPointerPoint = { x: Math.round(point.x), y: Math.round(point.y) };

      if (!reduced) {
        iconRef.current?.classList.add("helper-point-press");

        const ripple = rippleRef.current;

        if (ripple !== null) {
          ripple.style.left = `${Math.round(point.x)}px`;
          ripple.style.top = `${Math.round(point.y)}px`;
          ripple.classList.add("helper-ripple-run");
        }
      }

      /* O recorte acende no toque — a página escurece só então. */
      const rect = element.getBoundingClientRect();

      box.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
      box.style.width = `${rect.width}px`;
      box.style.height = `${rect.height}px`;
      box.style.opacity = "1";
    };

    /* Origem: último toque ou a própria bolha do assistente. */
    const bubble = readHelperPosition();
    const origin =
      lastPointerPoint ??
      (bubble === null
        ? { x: window.innerWidth - 76, y: window.innerHeight - 76 }
        : {
            x: clamp(bubble.x + 28, 8, window.innerWidth - 8),
            y: clamp(bubble.y + 28, 8, window.innerHeight - 8),
          });

    const destination = clickPoint();
    const distance = Math.hypot(
      destination.x - origin.x,
      destination.y - origin.y,
    );
    const travelMs =
      reduced || distance < 4
        ? 0
        : Math.min(
            TRAVEL_MAX_MS,
            Math.max(TRAVEL_MIN_MS, distance / TRAVEL_SPEED),
          );

    const start = performance.now();
    let arrived = false;
    let lit = false;
    let placed = false;
    let frame = 0;

    const tick = () => {
      const rect = element.getBoundingClientRect();
      const visible = rect.width >= 8 && rect.height >= 8;

      if (visible) {
        if (!placed) {
          placed = true;
          pointer.style.opacity = "1";
        }

        if (arrived) {
          /* Instalado: segue o alvo quadro a quadro (scroll, painéis). */
          writePointer(clickPoint());
        } else {
          const elapsed = performance.now() - start;
          const progress = travelMs === 0 ? 1 : Math.min(1, elapsed / travelMs);

          if (progress >= 1) {
            arrive();
          } else {
            const eased = easeOutCubic(progress);

            writePointer({
              x: origin.x + (destination.x - origin.x) * eased,
              y: origin.y + (destination.y - origin.y) * eased,
            });
          }
        }

        if (lit) {
          /* O recorte inteiro segue o alvo, frame a frame. */
          box.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
          box.style.width = `${rect.width}px`;
          box.style.height = `${rect.height}px`;
        }
      } else if (placed) {
        /* Alvo fora do fluxo: apaga tudo; a volta refaz o aparecimento. */
        placed = false;
        lit = false;
        box.style.opacity = "0";
        pointer.style.opacity = "0";
      }

      frame = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [element]);

  return (
    <>
      <div
        ref={boxRef}
        aria-hidden="true"
        className="helper-spotlight pointer-events-none fixed left-0 top-0 z-[90] will-change-transform"
        style={{ opacity: 0 }}
      >
        {/* Véu sobre a página — o recorte é o próprio elemento */}
        <span className="helper-veil absolute inset-0 rounded-card" />

        {/* Aro do recorte */}
        <span className="absolute inset-0 rounded-card border-2 border-lime" />

        {/* Aro que respira */}
        <span className="absolute inset-0 rounded-card border-2 border-lime animate-helper-pulse" />
      </div>

      <div
        ref={pointerRef}
        aria-hidden="true"
        className="helper-pointer pointer-events-none fixed left-0 top-0 z-[95] will-change-transform"
        style={{ opacity: 0 }}
      >
        {/* Onda do toque */}
        <span ref={rippleRef} className="helper-ripple absolute left-0 top-0" />

        <span
          ref={iconRef}
          aria-hidden="true"
          className="helper-pointer-icon absolute block"
          style={{ left: -POINTER_TIP.x, top: -POINTER_TIP.y }}
        >
          <CursorClick size={22} weight="fill" className="block" aria-hidden="true" />
        </span>
      </div>
    </>
  );
}
