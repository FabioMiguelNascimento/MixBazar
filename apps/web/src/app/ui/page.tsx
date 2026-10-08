/** Galeria de tokens e componentes — client de propósito: os ícones Phosphor só rodam no browser. */
"use client";

import Link from "next/link";
import {
  ChartLine,
  CheckCircle,
  CreditCard,
  Eye,
  Info,
  Lock,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  ShoppingCart,
  Tag,
  Trash,
  Warning,
  WarningCircle,
  XCircle,
  type Icon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DiscountForm } from "@/components/discount-form";
import { OrdersTable } from "@/components/orders-table";
import { SalesChart } from "@/components/sales-chart";

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="grid scroll-mt-4 gap-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="rounded-xl border p-4">{children}</div>
    </section>
  );
}

const PALETTE: { name: string; token: string; swatch: string; hex: string; rgb: string }[] = [
  { name: "Medium Jungle", token: "jungle", swatch: "bg-jungle", hex: "#4CA045", rgb: "76 · 160 · 69" },
  { name: "Platinum", token: "platinum", swatch: "bg-platinum", hex: "#F0F0F0", rgb: "240 · 240 · 240" },
  { name: "Gunmetal", token: "gunmetal", swatch: "bg-gunmetal", hex: "#414143", rgb: "65 · 65 · 67" },
  { name: "Green", token: "pine", swatch: "bg-pine", hex: "#197114", rgb: "25 · 113 · 20" },
  { name: "Yellow Green", token: "lime", swatch: "bg-lime", hex: "#A3CE36", rgb: "163 · 206 · 54" },
];

const ICONS: { name: string; Icon: Icon }[] = [  { name: "Tag", Icon: Tag },
  { name: "ShoppingCart", Icon: ShoppingCart },
  { name: "CreditCard", Icon: CreditCard },
  { name: "ChartLine", Icon: ChartLine },
  { name: "MagnifyingGlass", Icon: MagnifyingGlass },
  { name: "Plus", Icon: Plus },
  { name: "PencilSimple", Icon: PencilSimple },
  { name: "Trash", Icon: Trash },
  { name: "Eye", Icon: Eye },
  { name: "Lock", Icon: Lock },
  { name: "CheckCircle", Icon: CheckCircle },
  { name: "Info", Icon: Info },
  { name: "Warning", Icon: Warning },
  { name: "WarningCircle", Icon: WarningCircle },
  { name: "XCircle", Icon: XCircle },
];

export default function UiGalleryPage() {
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-8 bg-background px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-muted-foreground text-xs tracking-widest uppercase">
            Design system
          </p>
          <h1 className="text-2xl font-semibold">UI — tokens e componentes</h1>
          <p className="text-muted-foreground text-sm">
            Todas as cores (Tailwind v4 + shadcn) e todos os componentes do
            projeto num só lugar.
          </p>
        </div>
        <Button
          variant="outline"
          render={<Link href="/">Voltar ao dashboard</Link>}
        />
      </header>

      <Section
        id="paleta"
        title="Paleta do sistema"
        description="Só 5 cores. Todos os tokens funcionais (primary, muted, charts…) derivam delas via var() e color-mix."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {PALETTE.map((c) => (
            <div key={c.token} className="grid gap-1.5">
              <div
                className={`h-20 rounded-lg border ${c.swatch}`}
                role="img"
                aria-label={`${c.name} ${c.hex}`}
              />
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="font-mono text-xs">{c.token}</p>
                <p className="text-muted-foreground font-mono text-xs">
                  {c.hex} · {c.rgb}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="espacamentos"
        title="Espaçamentos"
        description="Escala semântica --spacing-2xs…3xl. Vale para padding (p-xs, px-md), margin e gap (gap-lg). 1rem = 16px."
      >
        <div className="grid gap-2">
          {(
            [
              ["2xs", "0.25rem · 4px", "w-1"],
              ["xs", "0.5rem · 8px", "w-2"],
              ["sm", "0.75rem · 12px", "w-3"],
              ["md", "1rem · 16px", "w-4"],
              ["lg", "1.5rem · 24px", "w-6"],
              ["xl", "2rem · 32px", "w-8"],
              ["2xl", "3rem · 48px", "w-12"],
              ["3xl", "4rem · 64px", "w-16"],
            ] as const
          ).map(([name, value, bar]) => (
            <div key={name} className="flex items-center gap-3">
              <span className="w-10 font-mono text-xs">{name}</span>
              <div className={`h-5 rounded-sm bg-jungle ${bar}`} />
              <span className="text-muted-foreground font-mono text-xs">
                --spacing-{name} · {value} · p-{name} / gap-{name}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="raios"
        title="Raios de borda"
        description="Aliases semânticos (rounded-button, rounded-card, rounded-input, rounded-dialog) sobre a escala do shadcn (rounded-sm…4xl)."
      >
        <div className="flex flex-wrap items-end gap-4">
          {(
            [
              ["button", "rounded-button", "--radius-button · pill"],
              ["input", "rounded-input", "--radius-input · 8px"],
              ["card", "rounded-card", "--radius-card · 10px"],
              ["dialog", "rounded-dialog", "--radius-dialog · 12px"],
            ] as const
          ).map(([name, cls, variable]) => (
            <div key={name} className="grid justify-items-center gap-1.5">
              <div className={`h-16 w-16 border-2 border-jungle ${cls}`} />
              <span className="text-xs font-medium">{name}</span>
              <span className="text-muted-foreground font-mono text-xs">
                {variable}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="variacoes"
        title="Superfícies e estados"
        description="Variações explícitas derivadas da paleta via color-mix. Cards flutuam sobre o fundo; hovers e actives têm token próprio em vez de opacidade."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {(
            [
              ["surface-card", "bg-surface-card", "--surface-card"],
              ["primary", "bg-primary", "--primary"],
              ["primary-hover", "bg-primary-hover", "--primary-hover"],
              ["primary-active", "bg-primary-active", "--primary-active"],
              ["secondary", "bg-secondary", "--secondary"],
              ["secondary-hover", "bg-secondary-hover", "--secondary-hover"],
              ["secondary-active", "bg-secondary-active", "--secondary-active"],
              ["success-bg", "bg-success-bg", "--success-bg"],
              ["warning-bg", "bg-warning-bg", "--warning-bg"],
              ["danger-bg", "bg-danger-bg", "--danger-bg"],
            ] as const
          ).map(([name, swatch, variable]) => (
            <div key={name} className="grid gap-1.5">
              <div
                className={`h-14 rounded-lg border ${swatch}`}
                role="img"
                aria-label={`Amostra de ${name}`}
              />
              <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-muted-foreground font-mono text-xs">
                  {variable}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="alerts"
        title="Alerts"
        description="Alert do shadcn com variantes success, info, warning e danger ligadas aos tokens."
      >
        <div className="grid gap-3">
          <Alert variant="success">
            <CheckCircle aria-hidden />
            <AlertTitle>Desconto aplicado</AlertTitle>
            <AlertDescription>
              O cupom SAVE10 foi aplicado ao pedido ord_001.
            </AlertDescription>
          </Alert>
          <Alert variant="info">
            <Info aria-hidden />
            <AlertTitle>Verifique os campos</AlertTitle>
            <AlertDescription>
              O código do pedido precisa ser um UUID válido.
            </AlertDescription>
          </Alert>
          <Alert variant="warning">
            <Warning aria-hidden />
            <AlertTitle>Cupom próximo do vencimento</AlertTitle>
            <AlertDescription>
              Esse cupom expira em 2 dias. Aplique logo.
            </AlertDescription>
          </Alert>
          <Alert variant="danger">
            <XCircle aria-hidden />
            <AlertTitle>Cupom não aplicado</AlertTitle>
            <AlertDescription>
              Não foi possível aplicar o desconto a este pedido.
            </AlertDescription>
          </Alert>
        </div>
      </Section>

      <Section
        id="botoes"
        title="Botões"
        description="Variantes e tamanhos do Button (shadcn + class-variance-authority)."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button size="xs">Extra pequeno</Button>
          <Button size="sm">Pequeno</Button>
          <Button size="default">Padrão</Button>
          <Button size="lg">Grande</Button>
          <Button size="icon" aria-label="Buscar">
            <MagnifyingGlass />
          </Button>
          <Button size="icon" variant="outline" aria-label="Adicionar">
            <Plus />
          </Button>
          <Button size="icon" variant="destructive" aria-label="Excluir">
            <Trash />
          </Button>
        </div>
      </Section>

      <Section
        id="formularios"
        title="Campos de formulário"
        description="Input + Label. Estado de erro usa aria-invalid (borda destructive). Validação com Zod no exemplo abaixo."
      >
        <div className="grid max-w-md gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="ui-nome">Nome</Label>
            <Input id="ui-nome" placeholder="Como podemos te chamar?" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ui-erro">Cupom</Label>
            <Input
              id="ui-erro"
              defaultValue=" errado "
              aria-invalid
              aria-describedby="ui-erro-msg"
            />
            <span id="ui-erro-msg" className="text-xs text-destructive">
              Esse cupom é inválido ou expirou. Confira o código.
            </span>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ui-disabled">Desabilitado</Label>
            <Input id="ui-disabled" placeholder="Não editável" disabled />
          </div>
        </div>
      </Section>

      <Section
        id="cards"
        title="Cards"
        description="Card, CardHeader, CardTitle, CardDescription, CardContent e CardFooter."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do pedido</CardTitle>
              <CardDescription>ord_001 · criado hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">R$ 129,90</p>
              <p className="text-muted-foreground text-sm">
                Desconto aplicado com sucesso.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Ver detalhes</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cupom inválido</CardTitle>
              <CardDescription>Exemplo do dicionário de erros</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">Cupom não aplicado</p>
              <p className="text-muted-foreground text-sm">
                Não foi possível aplicar o desconto a este pedido.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        id="tooltip"
        title="Tooltip"
        description="Passe o mouse para ver. Provider com delay de 300ms."
      >
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline">Passe o mouse aqui</Button>
          </TooltipTrigger>
          <TooltipContent>
            5 a 10 caracteres, apenas A–Z e 0–9. Tente SAVE10.
          </TooltipContent>
        </Tooltip>
      </Section>

      <Section
        id="icones"
        title="Ícones (Phosphor)"
        description="@phosphor-icons/react. Props size, weight (thin, regular, bold, fill, duotone) e color."
      >
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {ICONS.map(({ name, Icon: PhosphorIcon }) => (
            <div
              key={name}
              className="grid justify-items-center gap-1 rounded-lg border p-3"
            >
              <PhosphorIcon size={24} weight="duotone" aria-hidden />
              <span className="font-mono text-xs">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="tabela"
        title="Tabela de pedidos"
        description="Nosso OrdersTable: TanStack Table v9 + Table do shadcn."
      >
        <OrdersTable />
      </Section>

      <Section
        id="grafico"
        title="Gráfico de vendas"
        description="Nosso SalesChart: Recharts dentro do ChartContainer do shadcn."
      >
        <SalesChart />
      </Section>

      <Section
        id="desconto"
        title="Formulário de desconto"
        description="Nosso DiscountForm ao vivo: RHF + Zod, dicionário de erros e banner via Zustand. Tente um cupom errado para ver o CANNOT_APPLY_DISCOUNT traduzido."
      >
        <DiscountForm />
      </Section>
    </main>
  );
}
