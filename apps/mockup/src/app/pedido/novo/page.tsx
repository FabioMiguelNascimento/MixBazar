"use client";

import {
  ArrowRight,
  Check,
  ShoppingBag,
  Tag,
  UserCircle,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { BasketRecap } from "@/components/basket-recap";
import { Confirmation } from "@/components/order-confirmation";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  formatPrice,
  orderTotals,
  useBasket,
  type Order,
  type OrderLine,
} from "@/context/basket";
import { cartLinesToOrderLines, useCart } from "@/context/cart";
import { useCustomer } from "@/context/customer";
import { coupons, type Coupon } from "@/data/catalog";
import { buildOrderWhatsAppUrl } from "@/lib/whatsapp";
import { Button, buttonStyles } from "@repo/ui";

const STEPS = [
  { id: 1, label: "Revisão" },
  { id: 2, label: "Endereço" },
  { id: 3, label: "Confirmação" },
];

function Stepper({
  step,
  onSelect,
}: {
  step: number;
  onSelect: (step: number) => void;
}) {
  return (
    <ol aria-label="Etapas do pedido" className="flex items-center gap-2">
      {STEPS.map((item, index) => {
        const done = item.id < step;
        const current = item.id === step;
        return (
          <li
            key={item.id}
            className={`flex items-center gap-2 ${
              index < STEPS.length - 1 ? "flex-1" : ""
            }`}
          >
            <button
              type="button"
              disabled={!done}
              onClick={() => onSelect(item.id)}
              aria-current={current ? "step" : undefined}
              aria-label={`Etapa ${item.id}: ${item.label}`}
              className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition disabled:cursor-not-allowed ${
                done
                  ? "border-jungle bg-jungle text-platinum"
                  : current
                    ? "border-jungle text-jungle"
                    : "border-border text-pine/60"
              }`}
            >
              {done ? (
                <Check size={14} weight="bold" />
              ) : (
                <span>{item.id}</span>
              )}
            </button>

            <span
              className={`hidden whitespace-nowrap text-sm font-medium sm:block ${
                current
                  ? "text-gunmetal"
                  : done
                    ? "text-jungle"
                    : "text-pine/60"
              }`}
            >
              {item.label}
            </span>

            {index < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="mx-2 h-px flex-1 bg-border"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={0} activePath="/cesta" />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6">{children}</div>

      <SiteFooter />
    </main>
  );
}

function PedidoWizard({ source }: { source: "basket" | "cart" }) {
  const { baskets, activeId, sendActiveBasket, registerOrder } = useBasket();
  const { lines: cartLines, clear: clearCart } = useCart();
  const { profile, updateProfile, isLoggedIn } = useCustomer();
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState<Order | null>(null);
  const [draftAddress, setDraftAddress] = useState(profile.address);
  const [pickup, setPickup] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const router = useRouter();

  const isCart = source === "cart";
  const activeBasket =
    baskets.find((basket) => basket.id === activeId) ?? baskets[0];
  const draftLines: OrderLine[] = isCart
    ? cartLinesToOrderLines(cartLines)
    : activeBasket
      ? [{ kind: "basket", basket: activeBasket, quantity: 1 }]
      : [];
  const { subtotal } = orderTotals(draftLines);
  const backHref = isCart ? "/carrinho" : "/cesta/complementos";

  function continueToConfirmation() {
    if (!pickup && draftAddress.trim() === "") {
      setAddressError("Informe o endereço de entrega.");
      return;
    }
    setAddressError(null);
    if (!pickup) {
      updateProfile({ ...profile, address: draftAddress.trim() });
    }
    setStep(3);
  }

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const discount = appliedCoupon
    ? appliedCoupon.kind === "percent"
      ? Math.round(subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;
  const total = Math.max(0, subtotal - discount);

  function applyCoupon() {
    const found = coupons.find(
      (coupon) => coupon.code === couponCode.trim().toUpperCase(),
    );
    if (!found) {
      setCouponError("Cupom inválido ou expirado.");
      return;
    }
    setCouponError(null);
    setAppliedCoupon(found);
    setCouponCode("");
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  }

  function confirmOrder() {
    if (isCart) {
      const sent = registerOrder({
        lines: draftLines,
        address: pickup ? "" : profile.address,
        pickup,
        couponCode: appliedCoupon?.code ?? null,
        discount,
      });
      clearCart();
      window.open(
        buildOrderWhatsAppUrl(sent, profile.name),
        "_blank",
        "noopener,noreferrer",
      );
      setSent(sent);
    } else {
      const sent = sendActiveBasket(pickup ? "" : profile.address, pickup, {
        code: appliedCoupon?.code ?? null,
        discount,
      });
      window.open(
        buildOrderWhatsAppUrl(sent, profile.name),
        "_blank",
        "noopener,noreferrer",
      );
      setSent(sent);
    }
  }

  if (sent !== null) {
    return (
      <Shell>
        <Confirmation
          number={sent.number}
          onBack={() => router.push("/cesta")}
        />
      </Shell>
    );
  }

  if (!isLoggedIn) {
    return (
      <Shell>
        <div className="flex flex-col items-center py-20 text-center md:py-24">
          <UserCircle size={56} weight="duotone" className="text-pine" />

          <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
            Entre para continuar
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-pine/70">
            Para concluir seu pedido, entre na sua conta.
          </p>

          <Link
            href={`/login?next=${encodeURIComponent(isCart ? "/pedido/novo?from=carrinho" : "/pedido/novo")}`}
            className={buttonStyles({
              variant: "primary",
              size: "lg",
              className: "mt-7",
            })}
          >
            Entrar
            <ArrowRight size={17} />
          </Link>
        </div>
      </Shell>
    );
  }

  if (draftLines.length === 0) {
    return (
      <Shell>
        <div className="flex flex-col items-center py-20 text-center md:py-24">
          <ShoppingBag size={56} weight="duotone" className="text-pine" />

          <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
            {isCart ? "Seu carrinho está vazio" : "Sua cesta está vazia"}
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-pine/70">
            Adicione produtos antes de continuar.
          </p>

          <Link
            href={isCart ? "/carrinho" : "/cesta"}
            className={buttonStyles({
              variant: "primary",
              size: "lg",
              className: "mt-7",
            })}
          >
            {isCart ? "Voltar para o carrinho" : "Voltar para a cesta"}
            <ArrowRight size={17} />
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div
        className={`mx-auto w-full pb-20 pt-12 md:pb-24 md:pt-16 ${step === 3 ? "max-w-7xl" : "max-w-3xl"}`}
      >
        <Stepper step={step} onSelect={setStep} />

        {step === 1 && (
          <div className="mt-10">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
              Revise seu pedido
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
              Confira os itens e complementos antes de continuar.
            </p>

            <div className="mt-8">
              <BasketRecap lines={draftLines} />
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-pine">Subtotal</span>

              <span className="font-heading text-lg font-semibold text-gunmetal">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Link
                href={backHref}
                className={buttonStyles({ variant: "outline", size: "lg" })}
              >
                Voltar
              </Link>

              <Button
                variant="primary"
                size="lg"
                onClick={() => setStep(2)}
                className="sm:w-auto"
              >
                Continuar para endereço
                <ArrowRight size={17} />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-10">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
              Onde entregar?
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
              Vamos entregar para {profile.name} ({profile.phone}) no endereço
              abaixo.
            </p>

            <div className="mt-8">
              <label className="flex cursor-pointer items-center gap-3 rounded-button border border-border bg-background px-4 py-3 transition focus-within:border-jungle">
                <input
                  type="checkbox"
                  checked={pickup}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    setPickup(checked);
                    if (checked) {
                      setAddressError(null);
                    }
                  }}
                  className="sr-only"
                />

                <span
                  aria-hidden="true"
                  className={`h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${
                    pickup ? "bg-jungle" : "bg-input"
                  }`}
                >
                  <span
                    className={`block size-5 rounded-full bg-white shadow transition-transform ${
                      pickup ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </span>

                <span>
                  <span className="block text-sm font-medium text-gunmetal">
                    Retirar no local
                  </span>

                  <span className="mt-0.5 block text-xs text-pine/70">
                    Busque seu pedido no Mix Bazar
                  </span>
                </span>
              </label>

              <div className="mt-4">
                <label
                  htmlFor="delivery-address"
                  className="block text-sm font-medium text-gunmetal"
                >
                  Endereço de entrega
                </label>

                <textarea
                  id="delivery-address"
                  rows={3}
                  value={draftAddress}
                  onChange={(event) => setDraftAddress(event.target.value)}
                  aria-invalid={addressError !== null}
                  disabled={pickup}
                  className="mt-1.5 w-full rounded-input border border-input bg-background px-3 py-2.5 text-sm text-gunmetal outline-none placeholder:text-muted-foreground focus:border-jungle disabled:cursor-not-allowed disabled:opacity-60"
                />

                {addressError !== null && !pickup && (
                  <p role="alert" className="mt-1.5 text-xs text-danger-text">
                    {addressError}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep(1)}
              >
                Voltar
              </Button>

              <Button
                variant="primary"
                size="lg"
                onClick={continueToConfirmation}
                className="sm:w-auto"
              >
                Continuar para confirmação
                <ArrowRight size={17} />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-10">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
              Confirme seu pedido
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
              Tudo certo? O Mix Bazar confirma pelo atendimento.
            </p>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
              <div className="min-w-0">
                <BasketRecap lines={draftLines} />

                <div className="mt-4 rounded-card border border-border bg-background px-5 py-4">
                  {appliedCoupon === null ? (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        applyCoupon();
                      }}
                    >
                      <label
                        htmlFor="coupon-code"
                        className="text-sm font-medium text-gunmetal"
                      >
                        Cupom de desconto
                      </label>

                      <div className="mt-1.5 flex gap-2">
                        <input
                          id="coupon-code"
                          value={couponCode}
                          onChange={(event) => setCouponCode(event.target.value)}
                          placeholder="Ex.: MIX10"
                          aria-invalid={couponError !== null}
                          className="min-w-0 flex-1 rounded-input border border-input bg-background px-3 py-2.5 text-sm text-gunmetal uppercase outline-none placeholder:text-muted-foreground placeholder:normal-case focus:border-jungle"
                        />

                        <Button
                          variant="outline"
                          size="md"
                          type="submit"
                          className="shrink-0"
                        >
                          Aplicar
                        </Button>
                      </div>

                      {couponError !== null && (
                        <p
                          role="alert"
                          className="mt-1.5 text-xs text-danger-text"
                        >
                          {couponError}
                        </p>
                      )}
                    </form>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm">
                        <span className="flex items-center gap-2">
                          <span className="text-pine">Cupom</span>

                          <Tag
                            size={14}
                            weight="bold"
                            className="shrink-0 text-pine/60"
                          />

                          <span className="font-semibold text-gunmetal">
                            {appliedCoupon.code}
                          </span>
                        </span>

                        <span className="mt-0.5 block text-xs text-pine/70">
                          {appliedCoupon.description}
                        </span>
                      </p>

                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="shrink-0 text-sm font-medium text-jungle transition hover:text-pine"
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-card border border-border bg-background px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
                        {pickup ? "Retirada" : "Entrega"}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-pine">
                        {pickup ? "Retirada no local" : profile.address}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="shrink-0 text-sm font-medium text-jungle transition hover:text-pine"
                    >
                      Alterar
                    </button>
                  </div>
                </div>
              </div>

              <aside className="h-fit min-w-0 lg:sticky lg:top-24 lg:rounded-card lg:bg-platinum lg:p-7">
                <h2 className="font-heading text-xl font-semibold tracking-tight text-gunmetal">
                  Resumo
                </h2>

                <dl className="mt-4 space-y-3 text-sm">
                  {appliedCoupon !== null && (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-pine">Subtotal</dt>

                        <dd className="font-medium text-gunmetal">
                          {formatPrice(subtotal)}
                        </dd>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <dt>
                          <span className="flex items-center gap-2">
                            <span className="text-pine">Cupom</span>

                            <Tag
                              size={14}
                              weight="bold"
                              className="shrink-0 text-pine/60"
                            />

                            <span className="font-semibold text-gunmetal">
                              {appliedCoupon.code}
                            </span>
                          </span>

                          <span className="mt-0.5 block text-xs text-pine/70">
                            {appliedCoupon.description}
                          </span>
                        </dt>

                        <dd className="font-medium text-jungle">
                          -{formatPrice(discount)}
                        </dd>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between gap-4 border-t border-gunmetal/10 pt-3">
                    <dt className="font-heading text-base font-semibold text-gunmetal">
                      Total
                    </dt>

                    <dd className="font-heading text-base font-semibold text-gunmetal">
                      {formatPrice(total)}
                    </dd>
                  </div>
                </dl>

                <Button
                  variant="primary"
                  size="xl"
                  onClick={confirmOrder}
                  className="mt-5 w-full"
                >
                  Confirmar no WhatsApp
                  <WhatsappLogo size={18} weight="fill" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(2)}
                  className="mt-3 w-full"
                >
                  Voltar
                </Button>
              </aside>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

function PedidoSource() {
  const searchParams = useSearchParams();
  const source = searchParams.get("from") === "carrinho" ? "cart" : "basket";
  return <PedidoWizard source={source} />;
}

export default function PedidoNovoPage() {
  return (
    <Suspense>
      <PedidoSource />
    </Suspense>
  );
}
