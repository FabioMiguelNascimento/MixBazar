import { Heart, Plus, Tag } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { Product } from "@/data/catalog";
import { Button } from "@repo/ui";

export function ProductCard({
  product,
  favored,
  onToggleFavorite,
  onAdd,
}: {
  product: Product;
  favored: boolean;
  onToggleFavorite: () => void;
  onAdd: () => void;
}) {
  const href = `/produto/${product.id}`;

  return (
    <article className="group">
      <div className="relative aspect-[4/4.5] overflow-hidden rounded-card bg-platinum">
        <Link href={href} className="absolute inset-0 block">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
          />
        </Link>

        {product.badge && (
          <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-button bg-lime px-3 py-1.5 text-xs font-semibold text-gunmetal">
            <Tag size={12} weight="fill" />
            {product.badge}
          </span>
        )}

        <Button
          iconOnly
          tone="solid"
          iconSize="md"
          label={`Favoritar ${product.name}`}
          onClick={onToggleFavorite}
          className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          icon={
            <Heart
              size={18}
              weight={favored ? "fill" : "regular"}
              className={favored ? "text-jungle" : undefined}
            />
          }
        />

        <Button
          iconOnly
          tone="primary"
          iconSize="lg"
          label={`Adicionar ${product.name} ao carrinho`}
          onClick={onAdd}
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          icon={<Plus size={19} weight="bold" />}
        />
      </div>

      <Link href={href} className="block pt-5">
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
      </Link>
    </article>
  );
}
