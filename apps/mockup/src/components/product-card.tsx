import { Heart, Plus, Tag } from "@phosphor-icons/react/dist/ssr";
import type { Product } from "@/data/catalog";

export function ProductCard({
  product,
  favored,
  onToggleFavorite,
}: {
  product: Product;
  favored: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <article className="group">
      <div className="relative aspect-[4/4.5] overflow-hidden rounded-card bg-platinum">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
        />

        {product.badge && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-button bg-lime px-3 py-1.5 text-xs font-semibold text-gunmetal">
            <Tag size={12} weight="fill" />
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label={`Favoritar ${product.name}`}
          onClick={onToggleFavorite}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-platinum/90 text-pine opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 hover:text-jungle focus-visible:opacity-100"
        >
          <Heart
            size={18}
            weight={favored ? "fill" : "regular"}
            className={favored ? "text-jungle" : undefined}
          />
        </button>

        <button
          type="button"
          aria-label={`Adicionar ${product.name} à cesta`}
          className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-jungle text-platinum opacity-0 shadow-lg transition group-hover:opacity-100 hover:bg-primary-hover focus-visible:opacity-100"
        >
          <Plus size={19} weight="bold" />
        </button>
      </div>

      <div className="pt-5">
        <p className="text-xs font-medium text-pine/70">{product.category}</p>

        <h3 className="mt-1 font-heading text-base font-semibold tracking-tight text-gunmetal">
          {product.name}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.oldPrice}
            </span>
          )}

          <span className="font-heading text-base font-semibold text-gunmetal">
            {product.price}
          </span>
        </div>
      </div>
    </article>
  );
}
