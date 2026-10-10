import Link from "next/link";
import { categories } from "@/data/catalog";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/home"
              className="flex items-center gap-2.5"
              aria-label="Mix Bazar"
            >
              <img
                src="/mockup/LogoMix.svg"
                alt="Mix Bazar"
                className="size-8 object-contain"
              />

              <span className="font-heading text-base font-semibold text-gunmetal">
                Mix Bazar
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-pine/65">
              Cestas, flores, presentes e produtos para diferentes momentos.
              Encontre o que procura e faça seu pedido.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-pine">
              Categorias
            </p>

            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-pine/70">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href="/home#categorias"
                    className="transition hover:text-jungle"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-pine">
              Atendimento
            </p>

            <ul className="mt-4 grid gap-2 text-sm text-pine/70">
              <li>Segunda a sábado</li>
              <li>Consulte os horários do estabelecimento</li>
              <li>Pedidos pelo site e atendimento externo</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-pine/50">
            © {new Date().getFullYear()} Mix Bazar. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
