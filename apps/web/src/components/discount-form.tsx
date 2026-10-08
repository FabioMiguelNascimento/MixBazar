"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyDiscountSchema, type ApplyDiscountInput } from "@repo/contracts";
import { isApiError } from "@repo/types";
import { apiPost } from "@/lib/api";
import {
  friendlyDescription,
  friendlyTitle,
  parseApiError,
} from "@/lib/error-dictionary";
import { applyApiErrorsToForm } from "@/lib/error-form";
import { useUiStore } from "@/stores/use-ui-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DiscountForm() {
  const setBanner = useUiStore((s) => s.setBanner);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ApplyDiscountInput>({
    resolver: zodResolver(applyDiscountSchema),
    defaultValues: { orderId: "", discountCode: "" },
  });

  return (
    <form
      className="grid max-w-md gap-4 rounded-lg border p-4"
      onSubmit={handleSubmit(async (values) => {
        setBanner(null);
        try {
          await apiPost("discounts/apply", values);
          reset();
          setBanner("Desconto aplicado com sucesso!");
        } catch (err) {
          const payload = parseApiError(err);
          if (!payload || !isApiError(payload)) {
            setBanner("Algo deu errado. Tente novamente.");
            return;
          }
          const orphans = applyApiErrorsToForm(payload, setError);
          const title = friendlyTitle(payload.code);
          const desc = friendlyDescription(payload.code);
          setBanner(
            orphans.length > 0 ? orphans.join(" ") : `${title} — ${desc}`,
          );
        }
      })}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="orderId">Order ID (UUID)</Label>
        <Input
          id="orderId"
          placeholder="ex: 550e8400-..."
          {...register("orderId")}
        />
        {errors.orderId ? (
          <span className="text-xs text-destructive">{errors.orderId.message}</span>
        ) : null}
      </div>

      <div className="grid gap-1.5">
        <div className="flex items-center gap-2">
          <Label htmlFor="discountCode">Cupom</Label>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-muted-foreground cursor-help text-xs underline">
                formato?
              </span>
            </TooltipTrigger>
            <TooltipContent>
              5 a 10 caracteres, apenas A–Z e 0–9. Tente SAVE10.
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          id="discountCode"
          placeholder="SAVE10"
          {...register("discountCode")}
        />
        {errors.discountCode ? (
          <span className="text-xs text-destructive">
            {errors.discountCode.message}
          </span>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Aplicando..." : "Aplicar desconto"}
      </Button>
    </form>
  );
}
