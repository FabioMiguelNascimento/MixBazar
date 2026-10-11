import { formatPrice, type Order } from "@/context/basket";

const STORE_WHATSAPP_NUMBER = "5551999990000";

export function buildOrderWhatsAppUrl(
  order: Order,
  customerName: string,
): string {
  const lines = order.lines.map((line) => {
    if (line.kind === "product") {
      return `${line.quantity}x ${line.product.name} (${formatPrice(line.product.priceValue * line.quantity)})`;
    }
    const parts = line.basket.items.map(
      (item) => `${item.quantity}x ${item.product.name}`,
    );
    for (const complement of line.basket.complements) {
      parts.push(complement.option.name);
    }
    return `${line.quantity}x ${line.basket.name}: ${parts.join(", ")}`;
  });

  const body = [
    `Olá, Mix Bazar! Quero confirmar meu pedido #${order.number}`,
    ...lines.map((line) => `- ${line}`),
    `Subtotal: ${formatPrice(order.subtotal)}`,
    ...(order.discount > 0
      ? [
          `Desconto${order.couponCode ? ` (${order.couponCode})` : ""}: -${formatPrice(order.discount)}`,
        ]
      : []),
    `Total: ${formatPrice(order.subtotal - order.discount)}`,
    `Nome: ${customerName}`,
    order.pickup ? "Retirada no local" : `Entrega: ${order.address}`,
  ].join("\n");

  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
}
