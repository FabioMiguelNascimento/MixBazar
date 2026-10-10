import { Clock } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { formatDateTime, formatPrice, type Order } from "@/context/basket";

export function OrderCard({ order }: { order: Order }) {
  return (
    <li className="rounded-card border border-border bg-background transition hover:border-jungle">
      <Link
        href={`/pedidos/${order.id}`}
        aria-label={`Ver detalhes do pedido #${order.number}`}
        className="block p-6 md:p-7"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-heading text-lg font-semibold tracking-tight text-gunmetal">
              Pedido #{order.number} — {order.name}
            </p>

            <p className="mt-1 text-sm text-pine/70">
              Enviado em {formatDateTime(order.sentAt)} · {order.count}{" "}
              {order.count === 1 ? "item" : "itens"}
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-button bg-jungle/10 px-3 py-1.5 text-xs font-semibold text-jungle">
            <Clock size={12} />
            Aguardando confirmação
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <div className="flex items-center -space-x-3">
            {order.items.slice(0, 4).map((item) => (
              <img
                key={item.product.id}
                src={item.product.images[0]}
                alt={item.product.name}
                className="size-10 rounded-full object-cover ring-2 ring-background"
              />
            ))}

            {order.items.length > 4 && (
              <span className="flex size-10 items-center justify-center rounded-full bg-platinum text-xs font-semibold text-pine ring-2 ring-background">
                +{order.items.length - 4}
              </span>
            )}
          </div>

          <p className="text-sm text-pine">
            Total{" "}
            <span className="font-heading text-base font-semibold text-gunmetal">
              {formatPrice(order.subtotal)}
            </span>
          </p>
        </div>
      </Link>
    </li>
  );
}
