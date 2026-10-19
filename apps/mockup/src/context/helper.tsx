"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  ADMIN_TASKS,
  STORE_TASKS,
  type HelperStep,
  type HelperTask,
} from "@/components/helper/helper-tasks";

/**
 * Motor do assistente de demonstração.
 *
 * Cada passo aponta um elemento da tela (`data-helper`); o motor espera
 * o elemento aparecer (navegando sozinho quando o passo define `href`),
 * sinaliza o clique com o cursor e avança quando o usuário toca no
 * elemento sinalizado. O clique real é sempre do usuário — exceto
 * quando ele pede por "Próximo", e a demonstração executa a ação do
 * passo. Passos podem preencher formulários (`fill`, só campos vazios)
 * e são dispensados sozinhos quando não se aplicam (`optional`, com
 * `skipWhen`).
 */
const POSITION_KEY = "mockup-helper-pos";
const FIND_INTERVAL_MS = 80;
/* Em dev, a primeira visita a uma rota compila na visita — dá margem. */
const FIND_TIMEOUT_MS = 20_000;
/* Passo opcional sem `skipWhen` na tela: espera um pouco e pula. */
const OPTIONAL_SKIP_MS = 12_000;
const CORRECTION_DELAY_MS = 700;
const ADVANCE_DELAY_MS = 250;
/* Botão desabilitado não despacha clique — o "Próximo" segue adiante. */
const DISABLED_SKIP_MS = 2600;

export type HelperPosition = { x: number; y: number };

export type HelperPhase =
  | "idle"
  | "finding"
  | "ready"
  | "lost"
  | "finished";

/* ------------------------------------------------------------------ */
/* Store externo da posição da bolha (localStorage)                    */
/* ------------------------------------------------------------------ */

type PositionListener = () => void;

const positionListeners = new Set<PositionListener>();
let storedPosition: HelperPosition | null = null;
let positionLoaded = false;

function loadPosition() {
  if (positionLoaded || typeof window === "undefined") {
    return;
  }

  positionLoaded = true;

  try {
    const raw = window.localStorage.getItem(POSITION_KEY);

    if (raw === null) {
      return;
    }

    const parsed = JSON.parse(raw) as HelperPosition | null;

    if (
      parsed !== null &&
      Number.isFinite(parsed.x) &&
      Number.isFinite(parsed.y)
    ) {
      storedPosition = parsed;
    }
  } catch {
    // Valor inválido: segue no canto padrão.
  }
}

function subscribePosition(listener: PositionListener) {
  loadPosition();
  positionListeners.add(listener);

  function onStorage() {
    // Outra aba pode ter movido a bolha.
    positionLoaded = false;
    storedPosition = null;
    loadPosition();

    for (const emit of positionListeners) {
      emit();
    }
  }

  window.addEventListener("storage", onStorage);

  return () => {
    positionListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getPositionSnapshot(): HelperPosition | null {
  loadPosition();
  return storedPosition;
}

function getServerPositionSnapshot(): HelperPosition | null {
  return null;
}

function persistPosition(pos: HelperPosition | null) {
  storedPosition = pos;

  try {
    if (pos === null) {
      window.localStorage.removeItem(POSITION_KEY);
    } else {
      window.localStorage.setItem(POSITION_KEY, JSON.stringify(pos));
    }
  } catch {
    // Armazenamento indisponível: posição segue só em memória.
  }

  for (const emit of positionListeners) {
    emit();
  }
}

/* ------------------------------------------------------------------ */
/* Contexto                                                            */
/* ------------------------------------------------------------------ */

type HelperContextValue = {
  open: boolean;
  toggleOpen: () => void;
  /** Posição do canto superior esquerdo da bolha; null usa o canto padrão. */
  bubblePos: HelperPosition | null;
  setBubblePos: Dispatch<SetStateAction<HelperPosition | null>>;
  dragging: boolean;
  setDragging: Dispatch<SetStateAction<boolean>>;
  isStoreArea: boolean;
  tasks: HelperTask[];
  activeTask: HelperTask | null;
  stepIndex: number;
  step: HelperStep | null;
  phase: HelperPhase;
  activeElement: Element | null;
  startTask: (id: string) => void;
  nextStep: () => void;
  /** Próximo com ação: a demonstração executa o clique do passo atual. */
  performStep: () => void;
  prevStep: () => void;
  endTour: () => void;
};

const HelperContext = createContext<HelperContextValue | null>(null);

type TourState = {
  task: HelperTask | null;
  stepIndex: number;
  /** Passo/rota que esgotou a busca pelo alvo (por "Próximo" resolver). */
  lostKey: string | null;
  finished: boolean;
};

const INITIAL_TOUR: TourState = {
  task: null,
  stepIndex: 0,
  lostKey: null,
  finished: false,
};

export function HelperProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tour, setTour] = useState<TourState>(INITIAL_TOUR);
  const bubblePos = useSyncExternalStore(
    subscribePosition,
    getPositionSnapshot,
    getServerPositionSnapshot,
  );
  /** Alvo resolvido, vinculado a um passo/rota (`key`). */
  const [activeTarget, setActiveTarget] = useState<{
    element: Element;
    key: string;
  } | null>(null);

  const isStoreArea = !pathname.startsWith("/admin");
  /* Loja e painel no mesmo Painel — o usuário escolhe o fluxo em qualquer rota. */
  const tasks = [...STORE_TASKS, ...ADMIN_TASKS];

  const step = tour.task?.steps[tour.stepIndex] ?? null;
  const attemptKey =
    tour.task === null ? null : `${tour.task.id}#${tour.stepIndex}#${pathname}`;

  /* Estado derivado: resolve buscado/perdido/pronto sem mutar o tour. */
  const resolved =
    attemptKey !== null &&
    activeTarget !== null &&
    activeTarget.key === attemptKey &&
    activeTarget.element.isConnected;
  const hasTarget = step?.target !== undefined;
  const phase: HelperPhase =
    tour.task === null
      ? "idle"
      : tour.finished
        ? "finished"
        : !hasTarget
          ? "ready"
          : resolved
            ? "ready"
            : attemptKey !== null && tour.lostKey === attemptKey
              ? "lost"
              : "finding";

  const activeElement =
    phase === "ready" && resolved && step?.target !== undefined
      ? activeTarget?.element ?? null
      : null;

  /* refs p/ listeners e timers — atualizados uma vez por render. */
  const pathnameRef = useRef(pathname);
  const phaseRef = useRef<HelperPhase>(phase);
  const activeElementRef = useRef<Element | null>(activeElement);
  const resolvedKeyRef = useRef<string | null>(
    resolved && attemptKey !== null ? attemptKey : null,
  );

  useEffect(() => {
    pathnameRef.current = pathname;
    phaseRef.current = phase;
    activeElementRef.current = activeElement;
    resolvedKeyRef.current =
      resolved && attemptKey !== null ? attemptKey : null;
  });

  const startTask = useCallback((id: string) => {
    const task =
      STORE_TASKS.find((item) => item.id === id) ??
      ADMIN_TASKS.find((item) => item.id === id) ??
      null;

    if (task === null) {
      return;
    }

    setOpen(false);
    setTour({ task, stepIndex: 0, lostKey: null, finished: false });
  }, []);

  const nextStep = useCallback(() => {
    setTour((current) => {
      if (current.task === null || current.finished) {
        return current;
      }

      if (current.stepIndex >= current.task.steps.length - 1) {
        return { ...current, finished: true, lostKey: null };
      }

      return {
        ...current,
        stepIndex: current.stepIndex + 1,
        lostKey: null,
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    setTour((current) => {
      if (current.task === null || current.finished) {
        return current;
      }

      return {
        ...current,
        stepIndex: Math.max(0, current.stepIndex - 1),
        lostKey: null,
      };
    });
  }, []);

  const endTour = useCallback(() => {
    setTour(INITIAL_TOUR);
  }, []);

  /**
   * O clique real fica com o usuário; "Próximo" pede a ação à
   * demonstração: preenche o formulário do passo (só campos vazios),
   * despacha o clique no alvo e, se o alvo está desabilitado, segue
   * depois de um beat.
   */
  const performStep = useCallback(() => {
    const target = activeElement;
    const current = step;

    if (
      target === null ||
      current === null ||
      current.target === undefined ||
      !(target instanceof HTMLElement)
    ) {
      nextStep();
      return;
    }

    const inert = target.matches(":disabled, [aria-disabled='true']");

    for (const field of current.fill ?? []) {
      const input = document.querySelector<HTMLInputElement>(field.selector);

      if (input === null || input.value !== "") {
        continue;
      }

      /* Setter nativo + evento input: o React (input controlado) capta
         o valor como se fosse digitação. */
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;

      setter?.call(input, field.value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }

    /* O clique sai num macrotask depois do preenchimento: o React só
       commit o estado novo fora do mesmo evento. */
    window.setTimeout(
      () => {
        target.click();

        if (inert) {
          window.setTimeout(() => nextStep(), DISABLED_SKIP_MS);
        }
      },
      (current.fill?.length ?? 0) > 0 ? 460 : 0,
    );
  }, [activeElement, step, nextStep]);

  const toggleOpen = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const setBubblePos = useCallback(
    (value: SetStateAction<HelperPosition | null>) => {
      persistPosition(
        typeof value === "function"
          ? (
              value as (
                prev: HelperPosition | null,
              ) => HelperPosition | null
            )(getPositionSnapshot())
          : value,
      );
    },
    [],
  );

  /* --------------------------------------------------------------- */
  /* Passo ativo: espera o alvo e corrige a rota depois de um beat.    */
  /* Toda mudança de estado acontece em callbacks (timer/interval).    */
  /* --------------------------------------------------------------- */
  useEffect(() => {
    const task = tour.task;

    if (task === null || tour.finished) {
      return;
    }

    const currentStep = task.steps[tour.stepIndex] ?? null;

    if (currentStep === null) {
      return;
    }

    const attempt = `${task.id}#${tour.stepIndex}#${pathname}`;
    const target = currentStep.target;
    const href = currentStep.href;
    /* usePathname não inclui a query — compara só o caminho. */
    const hrefPath = href === undefined ? undefined : href.split("?")[0];

    /* Já resolvido para este passo e página — nada a fazer. */
    if (
      target !== undefined &&
      activeTarget !== null &&
      activeTarget.key === attempt &&
      activeTarget.element.isConnected
    ) {
      return;
    }

    /* Já dado por perdido neste passo e página — "Próximo" resolve. */
    if (target !== undefined && tour.lostKey === attempt) {
      return;
    }

    let cancelled = false;
    let timer: number | undefined;

    const correctionTimer =
      href === undefined
        ? undefined
        : window.setTimeout(() => {
            // O clique do passo anterior pode já ter navegado para cá;
            // a correção só age se o usuário continuou em outra página.
            if (
              cancelled ||
              pathnameRef.current === hrefPath ||
              resolvedKeyRef.current === attempt
            ) {
              return;
            }

            router.push(href);
          }, CORRECTION_DELAY_MS);

    if (target !== undefined) {
      const selector = target;
      const started = Date.now();

      timer = window.setInterval(() => {
        if (cancelled) {
          return;
        }

        const element = document.querySelector<HTMLElement>(selector);

        /* O alvo só vale na página do passo — o mesmo data-helper pode
           existir em outras rotas (ex.: cards de produto na Home). */
        if (
          element !== null &&
          (hrefPath === undefined || pathnameRef.current === hrefPath)
        ) {
          window.clearInterval(timer);
          setActiveTarget({ element, key: attempt });
          return;
        }

        /* `skipWhen` já na tela prova que o passo não se aplica
           (ex.: usuário logado dispensa os passos de entrada) —
           pula na hora, sem esperar o timeout. */
        if (
          currentStep.skipWhen !== undefined &&
          document.querySelector(currentStep.skipWhen) !== null
        ) {
          window.clearInterval(timer);
          nextStep();
          return;
        }

        /* Passo opcional esgotado: pula sozinho para não travar. */
        if (
          currentStep.optional === true &&
          Date.now() - started > OPTIONAL_SKIP_MS
        ) {
          window.clearInterval(timer);
          nextStep();
          return;
        }

        /* Sem href, o passo depende de um clique do usuário que navega
           por conta própria — não "se perde": o card orienta, e a busca
           continua até o alvo aparecer (auto-cura). */
        if (href !== undefined && Date.now() - started > FIND_TIMEOUT_MS) {
          window.clearInterval(timer);
          setTour((current) =>
            current.lostKey === null
              ? { ...current, lostKey: attempt }
              : current,
          );
        }
      }, FIND_INTERVAL_MS);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(correctionTimer);

      if (timer !== undefined) {
        window.clearInterval(timer);
      }
    };
  }, [
    tour.task,
    tour.stepIndex,
    tour.lostKey,
    tour.finished,
    pathname,
    activeTarget,
    router,
    nextStep,
  ]);

  /* --------------------------------------------------------------- */
  /* Alvo ativo: revela botões de hover e traz o elemento à tela.      */
  /* --------------------------------------------------------------- */
  useEffect(() => {
    const element = activeElement;

    if (element === null) {
      return;
    }

    element.setAttribute("data-helper-active", "");

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const rect = element.getBoundingClientRect();
    const margin = 64;
    const visible =
      rect.top >= margin &&
      rect.left >= 0 &&
      rect.right <= window.innerWidth &&
      rect.bottom <= window.innerHeight - margin;

    if (!visible) {
      element.scrollIntoView({
        behavior: reduced ? "instant" : "smooth",
        block: "center",
      });
    }

    return () => {
      element.removeAttribute("data-helper-active");
    };
  }, [activeElement]);

  /* --------------------------------------------------------------- */
  /* Clique no alvo avança o passo.                                   */
  /* --------------------------------------------------------------- */
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const element = activeElementRef.current;

      if (
        phaseRef.current !== "ready" ||
        element === null ||
        advanceTimer.current !== null
      ) {
        return;
      }

      if (!event.composedPath().includes(element)) {
        return;
      }

      advanceTimer.current = window.setTimeout(() => {
        advanceTimer.current = null;
        nextStep();
      }, ADVANCE_DELAY_MS);
    }

    document.addEventListener("click", handleClick, true);

    return () => document.removeEventListener("click", handleClick, true);
  }, [nextStep]);

  /* Troca de passo cancela um avanço pendente — a navegação do clique
     em si não deve cancelar (o avanço e a rota acontecem juntos). */
  useEffect(() => {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, [tour.task, tour.stepIndex]);

  const value = useMemo(
    () => ({
      open,
      toggleOpen,
      bubblePos,
      setBubblePos,
      dragging,
      setDragging,
      isStoreArea,
      tasks,
      activeTask: tour.task,
      stepIndex: tour.stepIndex,
      step,
      phase,
      activeElement,
      startTask,
      nextStep,
      performStep,
      prevStep,
      endTour,
    }),
    [
      open,
      toggleOpen,
      bubblePos,
      dragging,
      isStoreArea,
      tasks,
      tour.task,
      tour.stepIndex,
      step,
      phase,
      activeElement,
      startTask,
      nextStep,
      performStep,
      prevStep,
      endTour,
      setBubblePos,
    ],
  );

  return (
    <HelperContext.Provider value={value}>{children}</HelperContext.Provider>
  );
}

export function useHelper(): HelperContextValue {
  const context = useContext(HelperContext);

  if (!context) {
    throw new Error("useHelper deve ser usado dentro de HelperProvider");
  }

  return context;
}

/** Posição salva da bolha — origem do voo do ponteiro demonstrativo. */
export function readHelperPosition(): HelperPosition | null {
  loadPosition();
  return storedPosition;
}

export { POSITION_KEY as HELPER_POSITION_KEY };
