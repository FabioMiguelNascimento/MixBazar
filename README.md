# TCC — Turborepo (web + api + types/contracts/utils)

## Stack (scaffolds oficiais)

- **apps/web**: `create-next-app` (Next 16 + Tailwind v4) + `shadcn init/add` (button, input, label, tooltip, table, chart, card) + nuqs + Zustand + Zod + TanStack Table + TanStack Query + Recharts dentro do ChartContainer do shadcn (o TanStack não tem lib de charts) + React Hook Form + @hookform/resolvers (zod)
- **apps/api**: `nest new` (NestJS) + nestjs-zod (pipe global) + Drizzle ORM + Postgres + Better Auth
- **packages/types**: `ApiErrorPayload`, `FieldError`, `ErrorCode`
- **packages/contracts**: schemas Zod compartilhados (`applyDiscountSchema`)
- **packages/utils**: `AppError`, `createAppError`, `throwAppError`, `Errors.*`

## Padrão de erro

Falha sempre retorna:

```json
{
  "success": false,
  "code": "CANNOT_APPLY_DISCOUNT",
  "message": "Cannot apply discount to this order.",
  "error": [
    {
      "key": "discount_code",
      "message": "The discount code is invalid or has expired.",
      "regex": "^[A-Z0-9]{5,10}$",
      "validation": "discount_code.required.min_length=5.max_length=10.format=alphanumeric"
    }
  ]
}
```

### Backend — lançar erro

```ts
import { Errors, throwAppError } from "@repo/utils";

// helper pronto
throw Errors.cannotApplyDiscount();

// ou custom
throwAppError({
  code: "CANNOT_APPLY_DISCOUNT",
  message: "Cannot apply discount to this order.",
  status: 409,
  error: [{ key: "discount_code", message: "...", regex: "^[A-Z0-9]{5,10}$", validation: "discount_code..." }],
});
```

Validação de entrada usa **nestjs-zod**: DTOs via `createZodDto(schema)` + `app.useGlobalPipes(new ZodValidationPipe())`. O `AppErrorFilter` converte `AppError`, `ZodValidationException`, `ZodError` e `HttpException` para o formato acima.

### Frontend — dicionário + forms

- `apps/web/src/lib/error-dictionary.ts`: `CODE_MESSAGES` + `FIELD_MESSAGES` → `friendlyTitle/code`, `friendlyFieldMessage`. Nunca exiba `message` cru da API.
- `apps/web/src/lib/error-form.ts`: `applyApiErrorsToForm(payload, setError)` joga cada `error[]` no field do RHF já traduzido.
- `apps/web/src/lib/api.ts`: `apiPost()` lança o payload padronizado quando `!res.ok`.
- Exemplo completo em `apps/web/src/components/discount-form.tsx` (RHF + `zodResolver(applyDiscountSchema)` + dicionário + banner via Zustand).

## Como rodar

```bash
docker compose up -d        # postgres
cp .env.example .env        # ajuste se preciso
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

pnpm install
pnpm --filter api db:generate
pnpm --filter api db:migrate
pnpm dev                     # web :3000 + api :3001
```

Teste rápido: `POST http://localhost:3001/v1/discounts/apply` com `{"orderId":"<uuid>","discountCode":"ERRADO"}` → recebe `CANNOT_APPLY_DISCOUNT`.
