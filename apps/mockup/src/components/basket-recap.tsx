import { formatPrice, type OrderLine } from "@/context/basket";
import { complementGroups } from "@/data/catalog";

export function BasketRecap({ lines }: { lines: OrderLine[] }) {
  return (
    <div className="divide-y divide-border rounded-card border border-border bg-background px-5">
      <ul aria-label="Itens do pedido" className="divide-y divide-border">
        {lines.map((line, index) => {
          if (line.kind === "product") {
            return (
              <li
                key={`product-${line.product.id}-${index}`}
                className="flex items-center gap-3 py-3"
              >
                <img
                  src={line.product.images[0]}
                  alt=""
                  className="size-12 shrink-0 rounded-input object-cover"
                />

                <p className="min-w-0 flex-1 truncate text-sm font-medium text-gunmetal">
                  {line.product.name}{" "}
                  <span className="text-pine/70">× {line.quantity}</span>
                </p>

                <span className="shrink-0 text-sm font-semibold text-gunmetal">
                  {formatPrice(line.product.priceValue * line.quantity)}
                </span>
              </li>
            );
          }

          const basketTotal =
            (line.basket.items.reduce(
              (total, item) => total + item.quantity * item.product.priceValue,
              0,
            ) +
              line.basket.complements.reduce(
                (total, complement) => total + complement.option.priceValue,
                0,
              )) *
            line.quantity;
          return (
            <li
              key={`basket-${line.basket.id}-${index}`}
              className="py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-gunmetal">
                  {line.basket.name}{" "}
                  <span className="font-medium text-pine/70">
                    × {line.quantity}
                  </span>
                </p>

                <span className="shrink-0 text-sm font-semibold text-gunmetal">
                  {formatPrice(basketTotal)}
                </span>
              </div>

              <ul
                aria-label={`Itens da cesta ${line.basket.name}`}
                className="mt-1"
              >
                {line.basket.items.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex items-center gap-3 py-1.5"
                  >
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="size-10 shrink-0 rounded-input object-cover"
                    />

                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-gunmetal">
                      {item.product.name}{" "}
                      <span className="text-pine/70">
                        × {item.quantity}
                      </span>
                    </p>

                    <span className="shrink-0 text-sm font-semibold text-gunmetal">
                      {formatPrice(
                        item.product.priceValue * item.quantity,
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {line.basket.complements.length > 0 && (
                <ul
                  aria-label="Complementos da cesta"
                  className="ml-3 border-l-2 border-jungle/20 pl-3"
                >
                  {line.basket.complements.map((complement) => (
                    <li
                      key={complement.option.id}
                      className="flex items-center gap-3 py-1.5"
                    >
                      <p className="min-w-0 flex-1 truncate text-sm font-medium text-gunmetal">
                        {complement.option.name}{" "}
                        <span className="text-pine/70">
                          ·{" "}
                          {
                            complementGroups.find(
                              (group) =>
                                group.id === complement.groupId,
                            )?.name
                          }
                        </span>
                      </p>

                      <span className="shrink-0 text-sm font-semibold text-gunmetal">
                        {complement.option.price}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
