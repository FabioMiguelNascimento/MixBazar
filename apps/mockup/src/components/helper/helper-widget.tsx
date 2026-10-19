"use client";

import {
  CaretLeft,
  CaretRight,
  Lifebuoy,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";
import { Button } from "@repo/ui";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { HelperCursor } from "@/components/helper/helper-cursor";
import {
  HELPER_POSITION_KEY,
  useHelper,
  type HelperPosition,
} from "@/context/helper";
import { STORE_TASKS, ADMIN_TASKS, type HelperTask } from "@/components/helper/helper-tasks";

const MARGIN = 8;
const PANEL_WIDTH = "w-[21rem] max-w-[calc(100vw-2rem)]";
/* Folga ao redor do elemento destacado para medir sobreposição. */
const NUDGE_PAD = 16;

/* Sobreposição: só o alvo ganha a folga — o painel é medido cru. */
function overlapsTarget(
  widget: { left: number; top: number; width: number; height: number },
  target: { left: number; top: number; width: number; height: number },
  margin: number,
): boolean {
  return (
    widget.left < target.left + target.width + margin &&
    widget.left + widget.width > target.left - margin &&
    widget.top < target.top + target.height + margin &&
    widget.top + widget.height > target.top - margin
  );
}

function TaskButton({ task }: { task: HelperTask }) {
  const { startTask } = useHelper();
  const Icon = task.icon;

  return (
    <button
      type="button"
      onClick={() => startTask(task.id)}
      className="flex w-full items-center gap-3 rounded-button p-2 text-left transition hover:bg-muted"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-jungle/10 text-jungle">
        <Icon size={17} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-gunmetal">
          {task.label}
        </span>

        <span className="mt-0.5 block line-clamp-2 text-xs leading-5 text-pine/70">
          {task.description}
        </span>
      </span>

      <span className="shrink-0 text-[11px] font-medium text-pine/60">
        {task.steps.length} passos
      </span>
    </button>
  );
}

export function HelperWidget() {
  const pathname = usePathname();
  const {
    open,
    toggleOpen,
    bubblePos,
    setBubblePos,
    dragging,
    setDragging,
    activeTask,
    stepIndex,
    step,
    phase,
    activeElement,
    startTask,
    performStep,
    prevStep,
    endTour,
  } = useHelper();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragSize = useRef({ width: 0, height: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragOrigin = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const bubblePosRef = useRef(bubblePos);
  /* Desvio aplicado ao painel para não cobrir o elemento destacado. */
  const nudge = useRef<HelperPosition>({ x: 0, y: 0 });

  useEffect(() => {
    bubblePosRef.current = bubblePos;
  });

  function clampPosition(pos: HelperPosition): HelperPosition | null {
    const container = containerRef.current;

    if (container === null) {
      return pos;
    }

    const rect = container.getBoundingClientRect();
    const maxX = Math.max(MARGIN, window.innerWidth - rect.width - MARGIN);
    const maxY = Math.max(MARGIN, window.innerHeight - rect.height - MARGIN);

    return {
      x: Math.min(Math.max(pos.x, MARGIN), maxX),
      y: Math.min(Math.max(pos.y, MARGIN), maxY),
    };
  }

  function persistPosition(pos: HelperPosition | null) {
    try {
      if (pos === null) {
        window.localStorage.removeItem(HELPER_POSITION_KEY);
      } else {
        window.localStorage.setItem(HELPER_POSITION_KEY, JSON.stringify(pos));
      }
    } catch {
      // Armazenamento indisponível: posição segue só em memória.
    }
  }

  useEffect(() => {
    function handleResize() {
      setBubblePos((current) =>
        current === null ? null : clampPosition(current),
      );
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setBubblePos]);

  /* Painel aberto pode ser alto (nove fluxos): redobra o encaixe da
     âncora depois que ele entra no DOM — sem isso, uma bolha arrastada
     para baixo abre o painel fora da tela. */
  useLayoutEffect(() => {
    if (!open || bubblePos === null) {
      return;
    }

    const clamped = clampPosition(bubblePos);

    if (
      clamped !== null &&
      (clamped.x !== bubblePos.x || clamped.y !== bubblePos.y)
    ) {
      setBubblePos(clamped);
    }
  }, [open, bubblePos, setBubblePos]);

  /* ---------------------------------------------------------------- */
  /* Desvia o painel quando ele cobre o elemento destacado do passo.    */
  /* Escrita direta no style: o React nunca gerencia transform.         */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const container = containerRef.current;

    if (container === null || dragging) {
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const settle = reduced ? "none" : "transform 220ms ease-out";
    /* Depois de cada desvio, só re-avalia quando a transição se resolve —
       medir no meio do voo cria ping-pong. */
    const SETTLE_GUARD_MS = reduced ? 0 : 260;
    let frame = 0;
    let settleUntil = 0;

    const place = () => {
      if (performance.now() < settleUntil) {
        frame = requestAnimationFrame(place);
        return;
      }

      const target = activeElement;
      const applied = nudge.current;
      let next = { ...applied };

      if (target === null || !target.isConnected) {
        next = { x: 0, y: 0 };
      } else {
        const raw = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        /* A posição atual (com o desvio aplicado) já está livre?
           Então não se re-pensa nada: mantém o desvio — sem ping-pong. */
        if (overlapsTarget(raw, targetRect, NUDGE_PAD)) {
          const margin = 16;
          /* Base para o cálculo de fuga = onde o painel estaria sem o
             desvio aplicado (raw é final aqui, pós-guarda de settle). */
          const base = {
            left: raw.left - applied.x,
            top: raw.top - applied.y,
            right: raw.left - applied.x + raw.width,
            bottom: raw.top - applied.y + raw.height,
            width: raw.width,
            height: raw.height,
          };
          /* Direções de fuga: direita, esquerda, abaixo, acima. */
          const options = [
            { x: targetRect.right + margin - base.left, y: 0 },
            { x: targetRect.left - margin - base.right, y: 0 },
            { x: 0, y: targetRect.bottom + margin - base.top },
            { x: 0, y: targetRect.top - margin - base.bottom },
          ];
          let best: { cost: number; x: number; y: number } | null = null;

          for (const option of options) {
            const nx = Math.min(
              Math.max(base.left + option.x, MARGIN),
              Math.max(MARGIN, window.innerWidth - base.width - MARGIN),
            );
            const ny = Math.min(
              Math.max(base.top + option.y, MARGIN),
              Math.max(MARGIN, window.innerHeight - base.height - MARGIN),
            );

            if (
              overlapsTarget(
                { left: nx, top: ny, width: base.width, height: base.height },
                targetRect,
                margin,
              )
            ) {
              continue;
            }

            const cost = Math.abs(nx - base.left) + Math.abs(ny - base.top);

            if (best === null || cost < best.cost) {
              best = { cost, x: nx - base.left, y: ny - base.top };
            }
          }

          if (best !== null) {
            next = { x: best.x, y: best.y };
          }
        }
      }

      /* Só reescreve quando o desvio muda — a transição nunca recomeça. */
      if (next.x !== applied.x || next.y !== applied.y) {
        container.style.transition = settle;
        container.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
        nudge.current = next;
        settleUntil = performance.now() + SETTLE_GUARD_MS;
      }

      frame = requestAnimationFrame(place);
    };

    place();

    return () => cancelAnimationFrame(frame);
  }, [activeElement, dragging]);

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    const container = containerRef.current;

    if (container === null) {
      return;
    }

    /* Consolida o desvio anti-sobreposição na posição arrastada —
       o que o usuário vê é o que ele passa a arrastar. */
    const visual = container.getBoundingClientRect();
    const applied = nudge.current;
    const displaced = applied.x !== 0 || applied.y !== 0;

    container.style.transition = "none";
    container.style.transform = "";

    if (displaced) {
      setBubblePos({ x: visual.left, y: visual.top });
    }

    nudge.current = { x: 0, y: 0 };
    dragSize.current = { width: visual.width, height: visual.height };
    dragOffset.current = {
      x: event.clientX - visual.left,
      y: event.clientY - visual.top,
    };
    dragOrigin.current = displaced
      ? { x: visual.left, y: visual.top }
      : (bubblePosRef.current ?? { x: visual.left, y: visual.top });
    moved.current = false;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging) {
      return;
    }

    const size = dragSize.current;
    const maxX = Math.max(MARGIN, window.innerWidth - size.width - MARGIN);
    const maxY = Math.max(MARGIN, window.innerHeight - size.height - MARGIN);
    const x = Math.min(
      Math.max(event.clientX - dragOffset.current.x, MARGIN),
      maxX,
    );
    const y = Math.min(
      Math.max(event.clientY - dragOffset.current.y, MARGIN),
      maxY,
    );

    if (
      Math.abs(x - dragOrigin.current.x) > 3 ||
      Math.abs(y - dragOrigin.current.y) > 3
    ) {
      moved.current = true;
    }

    setBubblePos({ x, y });
  }

  function handlePointerUp() {
    if (!dragging) {
      return;
    }

    setDragging(false);
    persistPosition(bubblePosRef.current);
  }

  function handleBubbleActivate() {
    if (moved.current) {
      moved.current = false;
      return;
    }

    if (activeTask !== null) {
      endTour();
      return;
    }

    toggleOpen();
  }

  // Telas de experimento não recebem o assistente.
  if (pathname.startsWith("/preview")) {
    return null;
  }

  const touring = activeTask !== null && step !== null;
  const finished = phase === "finished";
  const currentStep = finished
    ? null
    : (activeTask?.steps[stepIndex] ?? null);

  return (
    <>
      {activeElement !== null && phase === "ready" && currentStep?.target !== undefined && (
        <HelperCursor element={activeElement} />
      )}

      <div
        ref={containerRef}
        className={`pointer-events-auto fixed z-[100] flex flex-col items-end gap-2.5 ${
          bubblePos === null ? "bottom-6 right-6" : ""
        } ${dragging ? "select-none" : ""}`}
        style={bubblePos === null ? undefined : { left: bubblePos.x, top: bubblePos.y }}
      >
        {!touring && open && (
          <div
            className={`${PANEL_WIDTH} max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-card border border-border bg-card p-4 shadow-lg`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
              Fluxos
            </p>

            <p className="mt-1 font-heading text-lg font-semibold tracking-tight text-gunmetal">
              Assistente do bazar
            </p>

            <p className="mt-1.5 text-xs leading-5 text-pine/70">
              Escolha um fluxo para demonstrar — me arraste pela tela.
            </p>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-pine/50">
              Loja
            </p>

            <ul className="mt-1 grid gap-1">
              {STORE_TASKS.map((task) => {
                return (
                  <li key={task.id}>
                    <TaskButton task={task} />
                  </li>
                );
              })}
            </ul>

            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-pine/50">
              Painel
            </p>

            <ul className="mt-1 grid gap-1">
              {ADMIN_TASKS.map((task) => {
                return (
                  <li key={task.id}>
                    <TaskButton task={task} />
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {activeTask !== null && (
          <div
            role="status"
            className={`${PANEL_WIDTH} rounded-card border border-border bg-card p-4 shadow-lg`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
                {finished
                  ? "Tudo pronto"
                  : `Passo ${stepIndex + 1} de ${activeTask.steps.length}`}
              </p>

              <button
                type="button"
                aria-label="Encerrar demonstração"
                onClick={endTour}
                className="shrink-0 rounded-full p-1 text-pine transition hover:bg-muted hover:text-jungle"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <p className="mt-2 text-sm font-medium leading-6 text-gunmetal">
              {finished
                ? "Demonstração concluída. Chame de novo quando quiser reforçar um fluxo."
                : currentStep?.text}
            </p>

            {!finished && phase === "finding" && (
              <p className="mt-1.5 text-xs text-pine/70">
                {currentStep?.findingText ??
                  (currentStep?.href === undefined
                    ? "Preparando a tela..."
                    : "Abrindo a próxima tela...")}
              </p>
            )}

            {!finished && phase === "ready" && currentStep?.target !== undefined && (
              <p className="mt-1.5 text-xs text-pine/70">
                Toque no elemento indicado — ou use Próximo e a demonstração
                faz a ação por você.
              </p>
            )}

            {!finished && phase === "lost" && (
              <p className="mt-1.5 text-xs text-pine/70">
                Não encontrei o elemento nesta tela — avance por aqui mesmo.
              </p>
            )}

            {!finished && (
              <div className="mt-3.5 flex items-center gap-2 border-t border-border pt-3.5">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<CaretLeft size={14} weight="bold" />}
                  onClick={prevStep}
                  disabled={stepIndex === 0}
                  className="disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Anterior
                </Button>

                <Button variant="outline" size="sm" onClick={performStep}>
                  Próximo
                  <CaretRight size={14} weight="bold" />
                </Button>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          aria-label={
            activeTask !== null
              ? "Encerrar demonstração"
              : open
                ? "Fechar assistente do bazar"
                : "Abrir assistente do bazar"
          }
          aria-expanded={activeTask === null ? open : undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleBubbleActivate}
          className={`flex size-14 touch-none items-center justify-center rounded-full bg-jungle text-platinum shadow-lg transition hover:bg-primary-hover ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {activeTask !== null ? <X size={24} /> : <Lifebuoy size={26} />}
        </button>
      </div>
    </>
  );
}
