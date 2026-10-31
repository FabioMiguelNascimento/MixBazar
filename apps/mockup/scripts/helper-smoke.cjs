/* Bateria de smoke do "Assistente do bazar".
 *
 * Cenários (todos locais, dev server precisa estar no ar na porta 3002):
 *   1. pedido    — tour "Fazer um pedido" completo dirigido por Próximo
 *                  (a ação é da demonstração: clicar alvos, preencher login).
 *   2. sessao    — pedido partindo de /login (gate de sessão + fill).
 *   3. produto   — tour admin de produto (drawer, Salvar desabilitado → skip).
 *   4. fechar    — ✕ do painel encerrando com o drawer aberto por trás.
 *   5. clientes  — tour do histórico do cliente conclui.
 *   6. connect   — tour do ConnectPlug concilia a demonstração sozinho.
 *   7. favoritar(+sessao) — coração no catálogo com sessão ativa e vazia.*
 *   8. conta(+sessao) — sair/entrar com sessão ativa; vazia pula os passos
 *      que exigem sessão e entra pelo topo.
 *   8. nudge     — desvio do painel sem oscilação (sem A→B→A dentro do passo).
 *
 * Uso: pnpm --filter mockup smoke [-- --only=pedido,connect]
 * Requer chromium em ~/.cache/ms-playwright (CHROME_BIN sobrepõe).
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const { homedir } = require("node:os");
const { chromium } = require("playwright-core");

const BASE = process.env.SMOKE_BASE ?? "http://localhost:3002/mockup";
const BUBBLE = '[aria-label="Abrir assistente do bazar"]';
const ENCERRAR = '[aria-label="Encerrar demonstração"]';
const NEXT = '[role="status"] button:has-text("Próximo")';

async function launch() {
  return chromium.launch({
    executablePath:
      process.env.CHROME_BIN ??
      `${homedir()}/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`,
    args: ["--no-sandbox"],
  });
}

function pageState() {
  return {
    path: `${location.pathname}${location.search}`,
    panel: document.querySelector('[role="status"]')?.textContent ?? "",
    active: document
      .querySelector("[data-helper-active]")
      ?.getAttribute("data-helper") ?? null,
    extra: "",
  };
}

/** Dirige o tour ativo com Próximo: alvo ativo executa a ação; passos
 * informativos (sem alvo) esperam assentar e seguem. Passa cada leitura
 * de estado para `onState`, quando informado. */
async function driveByNext(page, { max = 160, onState } = {}) {
  let lastPressed = -1;
  let stalls = 0;

  for (let i = 0; i < max; i++) {
    const state = await page.evaluate(pageState);

    onState?.(state);

    if (state.panel.includes("Demonstração concluída")) return true;

    const stepN = Number(/Passo (\d+)/.exec(state.panel)?.[1] ?? 0);

    if (stepN > 0 && stepN !== lastPressed) {
      if (state.active !== null) {
        await page.click(NEXT);
        lastPressed = stepN;
        stalls = 0;
      } else {
        stalls += 1;
        if (stalls >= 5) {
          await page.click(NEXT);
          lastPressed = stepN;
          stalls = 0;
        }
      }
    }

    await page.waitForTimeout(500);
  }

  return false;
}

async function startTour(page, taskLabel) {
  await page.locator(BUBBLE).waitFor({ timeout: 30_000 });
  await page.click(BUBBLE);
  await page.locator("text=Assistente do bazar").first().waitFor({ timeout: 30_000 });
  await page.locator(`button:has-text("${taskLabel}")`).first().click();
  await page.locator(NEXT).waitFor({ timeout: 60_000 });
}

async function closeTour(page) {
  await page.locator(ENCERRAR).last().click();
  await page.locator(BUBBLE).waitFor({ timeout: 10_000 });
}

/* --------------------------- cenários ----------------------------- */

/** 1. Tour do pedido completo por Próximo; carrinho esvazia ao confirmar. */
async function scenarioPedido(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded" });
  await startTour(page, "Fazer um pedido");

  const done = await driveByNext(page);

  if (!done) throw new Error("tour não concluiu");

  const badge = await page.evaluate(
    () =>
      document.querySelector('[data-helper="header-carrinho"]')?.textContent ??
      "",
  );
  await page.close();

  return { badge, resumo: "pedido concluído por Próximo" };
}

/** 2. Sessão vazia: Sai da conta (SPA sem goto depois) e roda o pedido;
 * gate → login com fill → conclusão. */
async function scenarioSessao(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(`${BASE}/conta`, { waitUntil: "domcontentloaded" });
  await page.click('[data-helper="conta-sair"]');
  await page.waitForURL("**/login", { timeout: 30_000 });

  await startTour(page, "Fazer um pedido");

  let sawGate = false;
  let sawFill = false;

  const done = await driveByNext(page, {
    onState: (state) => {
      if (state.active === "pedido-entrar") sawGate = true;
      if (state.active === "login-entrar") sawFill = true;
    },
  });

  if (!done) throw new Error("tour de sessão vazia não concluiu");
  if (!sawGate) throw new Error("gate de sessão não apareceu");
  if (!sawFill) throw new Error("login com fill não apareceu");
  await page.close();

  return { resumo: "gate + login com fill + conclusão" };
}

/** 3. Tour admin de produto com drawer e Salvar desabilitado (skip 2.6s). */
async function scenarioProduto(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded" });
  await startTour(page, "Cadastrar produto");

  const done = await driveByNext(page);
  const sawDrawer = await page.evaluate(
    () => document.body.textContent?.includes("Novo produto") ?? false,
  );

  if (!done) throw new Error("tour admin-produto não concluiu");
  if (!sawDrawer) throw new Error("drawer Novo produto não abriu no caminho");
  await page.close();

  return { resumo: "drawer abriu e skip de alvo desabilitado funcionou" };
}

/** 4. ✕ do painel encerra o tour com o drawer modal aberto por trás. */
async function scenarioFecharComDrawer(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(`${BASE}/admin/produtos`, { waitUntil: "domcontentloaded" });
  await startTour(page, "Cadastrar produto");

  /* Próximo abre o drawer no passo 2 e pula o Salvar desabilitado
     (fim). O drawer fica aberto quando o tour conclui. */
  const done = await driveByNext(page);

  if (!done) throw new Error("tour admin-produto não concluiu");

  const sawDrawer = await page.evaluate(
    () => document.body.textContent?.includes("Novo produto") ?? false,
  );

  if (!sawDrawer) throw new Error("drawer não ficou aberto ao fim do tour");

  await closeTour(page);

  const fechado = await page.evaluate(
    () => document.querySelector('[role="status"]') === null,
  );

  if (!fechado) throw new Error("✕ não encerrou o tour com drawer aberto");
  await page.close();

  return { resumo: "✕ atravessou o drawer modal corretamente" };
}

/** 5. Tour do histórico do cliente (novo módulo). */
async function scenarioClientes(browser) {  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded" });
  await startTour(page, "Histórico do cliente");

  const done = await driveByNext(page);

  if (!done) throw new Error("tour histórico do cliente não concluiu");
  await closeTour(page);
  await page.close();

  return { resumo: "navegou para Clientes e abriu o histórico por Próximo" };
}

/** 6. Tour do ConnectPlug concilia a planilha demo sozinho. */
async function scenarioConnect(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded" });
  await startTour(page, "Conciliar planilha");

  const done = await driveByNext(page);

  if (!done) throw new Error("tour ConnectPlug não concluiu");

  /* Efeito: cliente demo entrou na lista real da sessão. */
  await page.click('a[data-helper="admin-nav-clientes"]');
  await page.locator('[data-helper="admin-cliente-linha"]').first().waitFor({
    timeout: 30_000,
  });

  const conciliou = await page.evaluate(
    () => document.body.textContent?.includes("Sofia Andrade") ?? false,
  );

  if (!conciliou) throw new Error("tour não aplicou a conciliação demo");
  await closeTour(page);
  await page.close();

  return { resumo: "demo conciliada pelo tour (Sofia na lista)" };
}

/** 7. Desvio anti-stutter: nenhuma escrita de transform reverte dentro
 * do mesmo passo (invariante do nudge estável). */
async function scenarioNudge(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded" });
  await startTour(page, "Fazer um pedido");

  await page.evaluate(() => {
    const bubble = document.querySelector(
      '[aria-label="Encerrar demonstração"].size-14',
    );
    const container = bubble === null ? null : bubble.parentElement;
    const log = [];
    let last = container === null ? "?" : container.style.transform;

    window.__nudge = setInterval(() => {
      const t = container === null ? "?" : container.style.transform;

      if (t !== last) {
        log.push({ at: Date.now(), from: last, to: t });
        last = t;
      }
    }, 25);

    window.__nudgeLog = log;
  });

  const done = await driveByNext(page, { max: 200 });

  if (!done) throw new Error("tour do nudge não concluiu");

  await page.waitForTimeout(1500);

  const log = await page.evaluate(async () => {
    clearInterval(window.__nudge);
    return window.__nudgeLog;
  });

  /* Oscilação = três escritas em zigzag (X→Y, Y→X, X→Y) em janela
     curta. Reset único de fim de passo (Y→0) é legítimo. */
  const flaps = [];

  for (let i = 2; i < log.length; i++) {
    const a = log[i - 2];
    const b = log[i - 1];
    const c = log[i];

    if (
      b.to === a.from &&
      c.to === a.to &&
      c.at - a.at < 1200 &&
      a.to !== "translate3d(0px, 0px, 0px)"
    ) {
      flaps.push(`${a.from} ⇄ ${a.to} ⇄ ${c.to}`);
    }
  }

  if (flaps.length > 0) {
    throw new Error(`desvio oscilando: ${flaps.join("; ")}`);
  }
  await page.close();

  return {
    resumo: `${log.length} escrita(s) de desvio, sem reversões < 400ms`,
  };
}

/** 8. Favoritar com sessão ativa: gate pula sozinho via skipWhen. */
async function scenarioFavoritar(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded" });
  await startTour(page, "Guardar favoritos");

  const done = await driveByNext(page);
  const caminho = await page.evaluate(() =>
    location.pathname.replace(/^\/mockup/, ""),
  );

  if (!done) throw new Error("tour favoritar não concluiu (sessão ativa)");
  if (caminho !== "/conta/favoritos") {
    throw new Error(`tour terminou em ${caminho}, não em favoritos`);
  }
  await closeTour(page);
  await page.close();

  return { resumo: "concluiu em /conta/favoritos, gate pulado" };
}

/** 9. Favoritar em sessão vazia: gate → login com fill → favoritos. */
async function scenarioFavoritarSemSessao(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(`${BASE}/conta`, { waitUntil: "domcontentloaded" });
  await page.click('[data-helper="conta-sair"]');
  await page.waitForURL("**/login", { timeout: 30_000 });

  await startTour(page, "Guardar favoritos");

  let sawGate = false;

  const done = await driveByNext(page, {
    onState: (state) => {
      if (state.active === "login-entrar") sawGate = true;
    },
  });

  const caminho = await page.evaluate(() =>
    location.pathname.replace(/^\/mockup/, ""),
  );

  if (!done) throw new Error("tour favoritar não concluiu (sessão vazia)");
  if (!sawGate) throw new Error("gate de login do favoritar não apareceu");
  if (caminho !== "/conta/favoritos") {
    throw new Error(`tour terminou em ${caminho}, não em favoritos`);
  }
  await closeTour(page);
  await page.close();

  return { resumo: "sessão vazia: gate + login com fill + favoritos" };
}

/** 10. Tour da conta com sessão ativa (fluxo clássico com 로그아웃). */
async function scenarioConta(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded" });
  await startTour(page, "Entrar na sua conta");

  const done = await driveByNext(page);
  const caminho = await page.evaluate(() =>
    location.pathname.replace(/^\/mockup/, ""),
  );

  if (!done) throw new Error("tour conta não concluiu (sessão ativa)");
  if (caminho !== "/conta/dados") {
    throw new Error(`tour conta terminou em ${caminho}, não em /conta/dados`);
  }
  await closeTour(page);
  await page.close();

  return { resumo: "sair → login com fill → dados salvos" };
}

/** 11. Tour da conta em sessão vazia: entra pelo topo e os passos que
 * exigem sessão pulam direto; login com fill termina nos dados. */
async function scenarioContaSemSessao(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(`${BASE}/conta`, { waitUntil: "domcontentloaded" });
  await page.click('[data-helper="conta-sair"]');
  await page.waitForURL("**/login", { timeout: 30_000 });

  await startTour(page, "Entrar na sua conta");

  let sawLogin = false;

  const done = await driveByNext(page, {
    onState: (state) => {
      if (state.active === "login-entrar") sawLogin = true;
    },
  });

  const caminho = await page.evaluate(() =>
    location.pathname.replace(/^\/mockup/, ""),
  );

  if (!done) throw new Error("tour conta não concluiu (sessão vazia)");
  if (!sawLogin) throw new Error("passo de login não apareceu na sessão vazia");
  if (caminho !== "/conta/dados") {
    throw new Error(`tour conta terminou em ${caminho}, não em /conta/dados`);
  }
  await closeTour(page);
  await page.close();

  return { resumo: "sessão vazia: pulos rápidos + login com fill + dados" };
}

/* ---------------------------- runner ------------------------------ */

const SCENARIOS = [
  ["pedido", scenarioPedido],
  ["sessao", scenarioSessao],
  ["produto", scenarioProduto],
  ["fechar", scenarioFecharComDrawer],
  ["clientes", scenarioClientes],
  ["connect", scenarioConnect],
  ["favoritar", scenarioFavoritar],
  ["favoritar-sessao", scenarioFavoritarSemSessao],
  ["conta", scenarioConta],
  ["conta-sessao", scenarioContaSemSessao],
  ["nudge", scenarioNudge],
];

const onlyArg = process.argv
  .find((arg) => arg.startsWith("--only="))
  ?.slice(7);

const selected = SCENARIOS.filter(([name]) =>
  onlyArg === undefined ? true : onlyArg.split(",").includes(name),
);

(async () => {
  const browser = await launch();
  const failures = [];

  for (const [name, run] of selected) {
    try {
      const detail = await run(browser);
      console.log(`PASS ${name} — ${detail.resumo}${detail.badge !== undefined ? ` (badge ${detail.badge})` : ""}`);
    } catch (error) {
      failures.push(name);
      console.error(`FAIL ${name} — ${error.message ?? error}`);
    }
  }

  await browser.close();

  if (failures.length > 0) {
    console.error(`\n${failures.length} cenário(s) falharam: ${failures.join(", ")}`);
    process.exit(1);
  }

  console.log("\nSMOKE OK");
})();
