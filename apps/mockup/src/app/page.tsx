import {
  ArrowRight,
  Check,
  Heart,
  MagnifyingGlass,
  PaintBrush,
  Plus,
  ShoppingBag,
  Star,
  Tag,
  TrendUp,
  User,
} from "@phosphor-icons/react/dist/ssr";

const swatches = [
  {
    name: "jungle",
    value: "Marca principal",
    className: "bg-jungle",
    text: "text-platinum",
  },
  {
    name: "pine",
    value: "Verde profundo",
    className: "bg-pine",
    text: "text-platinum",
  },
  {
    name: "lime",
    value: "Destaques",
    className: "bg-lime",
    text: "text-gunmetal",
  },
  {
    name: "platinum",
    value: "Base / superfície",
    className: "bg-platinum",
    text: "text-gunmetal",
  },
  {
    name: "gunmetal",
    value: "Texto principal",
    className: "bg-gunmetal",
    text: "text-platinum",
  },
];

const categories = [
  "Cestas",
  "Flores",
  "Presentes",
  "Escolar",
  "Bazar",
  "Encomendas",
];

const products = [
  {
    name: "Cesta Café da Manhã",
    category: "Cestas",
    price: "R$ 89,90",
    oldPrice: "R$ 109,90",
    featured: true,
  },
  {
    name: "Buquê de Flores",
    category: "Flores",
    price: "R$ 64,90",
    oldPrice: null,
    featured: false,
  },
  {
    name: "Kit Presente Especial",
    category: "Presentes",
    price: "R$ 74,90",
    oldPrice: null,
    featured: false,
  },
];

export default function MockupHome() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-2 text-sm font-medium text-jungle">
            <PaintBrush size={18} weight="duotone" />
            <span>Mix Bazar · Design System</span>
          </div>

          <div className="mt-5 max-w-3xl">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-gunmetal md:text-5xl">
              Componentes da plataforma
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Representação visual dos principais elementos que compõem a
              experiência do Mix Bazar. A identidade utiliza exclusivamente a
              paleta definida no tema da aplicação.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="rounded-button bg-muted px-3 py-1.5">
              sem autenticação
            </span>
            <span className="rounded-button bg-muted px-3 py-1.5">
              sem backend
            </span>
            <span className="rounded-button bg-muted px-3 py-1.5">
              mockup
            </span>
            <span className="rounded-button bg-muted px-3 py-1.5">
              @repo/ui
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-10">
        {/* Cores */}
        <section>
          <SectionHeader
            eyebrow="01 · Identidade"
            title="Paleta de cores"
            description="As cinco cores formam a base visual da plataforma."
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {swatches.map((swatch) => (
              <div
                key={swatch.name}
                className="overflow-hidden rounded-card border border-border bg-card"
              >
                <div
                  className={`flex h-28 items-end p-4 ${swatch.className} ${swatch.text}`}
                >
                  <span className="font-mono text-xs font-medium">
                    {swatch.name}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-sm font-medium text-gunmetal">
                    {swatch.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tipografia */}
        <section>
          <SectionHeader
            eyebrow="02 · Tipografia"
            title="Hierarquia de texto"
            description="Outfit para títulos e Nunito Sans para interface e conteúdo."
          />

          <div className="mt-5 rounded-card border border-border bg-card p-6 md:p-8">
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-pine">
                  Heading
                </p>
                <h2 className="font-heading text-4xl font-semibold tracking-tight text-gunmetal">
                  Encontre algo especial
                </h2>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-pine">
                  Subheading
                </p>
                <p className="text-xl text-pine">
                  Produtos para todos os momentos.
                </p>
              </div>

              <div className="max-w-2xl">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-pine">
                  Body
                </p>
                <p className="leading-7 text-muted-foreground">
                  Explore produtos, monte sua própria cesta e envie sua
                  solicitação para o Mix Bazar continuar o atendimento.
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-pine">
                  Price
                </p>
                <p className="font-heading text-3xl font-semibold text-gunmetal">
                  R$ 89,90
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Botões */}
        <section>
          <SectionHeader
            eyebrow="03 · Ações"
            title="Botões e controles"
            description="Ações principais devem utilizar Jungle. Lime fica reservado para destaque."
          />

          <div className="mt-5 rounded-card border border-border bg-card p-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-button bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover active:bg-primary-active"
              >
                Comprar
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-button bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition hover:bg-secondary-hover active:bg-secondary-active"
              >
                Montar cesta
                <Plus size={16} />
              </button>

              <button
                type="button"
                className="rounded-button border border-border bg-background px-5 py-2.5 text-sm font-medium text-gunmetal transition hover:bg-muted"
              >
                Ver detalhes
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-button bg-jungle px-5 py-2.5 text-sm font-medium text-platinum transition hover:bg-primary-hover"
              >
                <ShoppingBag size={17} />
                Ver cesta
              </button>

              <button
                type="button"
                className="rounded-button p-2.5 text-pine transition hover:bg-muted"
                aria-label="Favoritar"
              >
                <Heart size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <SectionHeader
            eyebrow="04 · Formulários"
            title="Campos de entrada"
            description="Controles simples, claros e com baixo ruído visual."
          />

          <div className="mt-5 grid gap-4 rounded-card border border-border bg-card p-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gunmetal">
                Buscar produtos
              </label>

              <div className="flex h-11 items-center gap-3 rounded-input border border-input bg-background px-3 transition focus-within:border-jungle focus-within:ring-2 focus-within:ring-jungle/20">
                <MagnifyingGlass size={19} className="text-pine" />

                <input
                  type="text"
                  placeholder="O que você está procurando?"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gunmetal">
                Cliente
              </label>

              <div className="flex h-11 items-center gap-3 rounded-input border border-input bg-background px-3">
                <User size={19} className="text-pine" />

                <input
                  type="text"
                  placeholder="Nome do cliente"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section>
          <SectionHeader
            eyebrow="05 · Feedback"
            title="Badges e estados"
            description="Estados visuais para produtos, solicitações e ações."
          />

          <div className="mt-5 flex flex-wrap gap-3 rounded-card border border-border bg-card p-6">
            <Badge variant="success">Disponível</Badge>
            <Badge variant="info">Em atendimento</Badge>
            <Badge variant="warning">Sob encomenda</Badge>
            <Badge variant="danger">Indisponível</Badge>

            <span className="inline-flex items-center gap-1.5 rounded-button bg-lime px-3 py-1.5 text-xs font-semibold text-gunmetal">
              <Tag size={14} weight="fill" />
              Promoção
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-button bg-muted px-3 py-1.5 text-xs font-medium text-pine">
              <TrendUp size={14} />
              Destaque
            </span>
          </div>
        </section>

        {/* Categorias */}
        <section>
          <SectionHeader
            eyebrow="06 · Navegação"
            title="Categorias"
            description="Filtros rápidos para descoberta de produtos."
          />

          <div className="mt-5 flex flex-wrap gap-2">
            <button className="rounded-button bg-jungle px-4 py-2 text-sm font-medium text-platinum">
              Todos
            </button>

            {categories.map((category) => (
              <button
                key={category}
                className="rounded-button border border-border bg-card px-4 py-2 text-sm font-medium text-pine transition hover:border-jungle hover:text-jungle"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Produtos */}
        <section>
          <SectionHeader
            eyebrow="07 · E-commerce"
            title="Cards de produto"
            description="O produto é o protagonista da experiência de descoberta."
            action="Ver catálogo"
          />

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </section>

        {/* Banner */}
        <section>
          <SectionHeader
            eyebrow="08 · Destaque"
            title="Banner promocional"
            description="Área para campanhas, datas sazonais e chamadas importantes."
          />

          <div className="relative mt-5 overflow-hidden rounded-card bg-jungle p-8 text-platinum md:p-10">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex rounded-button bg-lime px-3 py-1 text-xs font-semibold text-gunmetal">
                Novidade
              </span>

              <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                Monte uma cesta do seu jeito
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-platinum/80">
                Escolha os produtos, organize sua composição e envie sua
                solicitação para o Mix Bazar.
              </p>

              <button className="mt-6 inline-flex items-center gap-2 rounded-button bg-lime px-5 py-2.5 text-sm font-semibold text-gunmetal hover:bg-secondary-hover">
                Criar minha cesta
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="absolute -right-16 -top-20 size-64 rounded-full bg-lime/20 blur-3xl" />
            <div className="absolute -bottom-20 right-20 size-48 rounded-full bg-platinum/10 blur-3xl" />
          </div>
        </section>

        {/* Solicitação */}
        <section>
          <SectionHeader
            eyebrow="09 · Processo comercial"
            title="Solicitação de produtos"
            description="A plataforma não simula um checkout tradicional."
          />

          <div className="mt-5 rounded-card border border-border bg-card p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-success-bg text-jungle">
                    <Check size={20} weight="bold" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gunmetal">
                      Solicitação #00042
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Atualizada há 5 minutos
                    </p>
                  </div>
                </div>
              </div>

              <Badge variant="info">Em atendimento</Badge>

              <button className="inline-flex items-center gap-2 rounded-button bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Acompanhar
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Espaçamento */}
        <section>
          <SectionHeader
            eyebrow="10 · Layout"
            title="Ritmo visual"
            description="Espaçamentos usados para manter consistência entre seções."
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["xs", "0.5rem"],
              ["sm", "0.75rem"],
              ["md", "1rem"],
              ["lg", "1.5rem"],
              ["xl", "2rem"],
              ["2xl", "3rem"],
              ["3xl", "4rem"],
            ].map(([name, value]) => (
              <div
                key={name}
                className="flex items-center gap-4 rounded-card border border-border bg-card p-4"
              >
                <div
                  className="shrink-0 rounded-sm bg-jungle"
                  style={{ width: value, height: value }}
                />

                <div>
                  <p className="font-mono text-xs font-medium text-gunmetal">
                    {name}
                  </p>
                  <p className="text-xs text-muted-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
          {eyebrow}
        </p>

        <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-gunmetal">
          {title}
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {action && (
        <button className="inline-flex items-center gap-2 text-sm font-medium text-jungle hover:text-pine">
          {action}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "success" | "info" | "warning" | "danger";
}) {
  const variants = {
    success:
      "border-success-border bg-success-bg text-success-text",
    info:
      "border-info-border bg-info-bg text-info-text",
    warning:
      "border-warning-border bg-warning-bg text-warning-text",
    danger:
      "border-danger-border bg-danger-bg text-danger-text",
  };

  return (
    <span
      className={`inline-flex rounded-button border px-3 py-1.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

function ProductCard({
  product,
}: {
  product: {
    name: string;
    category: string;
    price: string;
    oldPrice: string | null;
    featured: boolean;
  };
}) {
  return (
    <article className="group overflow-hidden rounded-card border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gunmetal/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <div className="absolute inset-0 flex items-center justify-center text-pine/40">
          <ShoppingBag size={42} weight="duotone" />
        </div>

        {product.featured && (
          <span className="absolute left-3 top-3 rounded-button bg-lime px-3 py-1 text-xs font-semibold text-gunmetal">
            Destaque
          </span>
        )}

        <button
          type="button"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-platinum/90 text-pine shadow-sm backdrop-blur transition hover:text-jungle"
          aria-label="Favoritar produto"
        >
          <Heart size={18} />
        </button>
      </div>

      <div className="p-5">
        <p className="text-xs font-medium text-pine">{product.category}</p>

        <h3 className="mt-1 font-heading text-lg font-semibold text-gunmetal">
          {product.name}
        </h3>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            {product.oldPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {product.oldPrice}
              </p>
            )}

            <p className="font-heading text-xl font-semibold text-gunmetal">
              {product.price}
            </p>
          </div>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-jungle text-platinum transition hover:bg-primary-hover"
            aria-label="Adicionar ao carrinho"
          >
            <Plus size={19} weight="bold" />
          </button>
        </div>
      </div>
    </article>
  );
}