"use client";

import { CaretRight, PencilLine } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ServiceBar } from "@/components/service-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  useCustomer,
  type CustomerProfile,
} from "@/context/customer";
import { Button } from "@repo/ui";

const PROFILE_FIELDS = [
  { key: "name", label: "Nome", inputType: "text" },
  { key: "email", label: "E-mail", inputType: "email" },
  { key: "phone", label: "Telefone", inputType: "tel" },
  { key: "address", label: "Endereço", inputType: "text" },
] as const;

export default function DadosPage() {
  const { profile, updateProfile, favorites, isLoggedIn } = useCustomer();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CustomerProfile>(profile);

  function startEdit() {
    setDraft(profile);
    setEditing(true);
  }

  function setField(key: keyof CustomerProfile, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function saveEdit() {
    updateProfile({ ...draft, name: draft.name.trim() || profile.name });
    setEditing(false);
  }

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <ServiceBar />

      <SiteHeader favoritesCount={favorites.length} activePath="/conta" />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6">
        <nav
          aria-label="Trilha de navegação"
          className="flex flex-wrap items-center gap-1.5 py-5 text-sm text-pine"
        >
          <Link href="/conta" className="transition hover:text-jungle">
            Minha conta
          </Link>
          <CaretRight size={13} weight="bold" className="text-pine/40" />
          <span className="text-gunmetal">Meus dados</span>
        </nav>

        <section className="pb-20 md:pb-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
                Minha conta
              </p>

              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
                Meus dados
              </h1>
            </div>

            {!editing && (
              <Button
                variant="outline"
                size="xs"
                icon={<PencilLine size={16} />}
                onClick={startEdit}
                data-helper="conta-editar"
                className="hover:border-jungle hover:text-jungle hover:bg-transparent"
              >
                Editar
              </Button>
            )}
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
            Seus dados para o atendimento do Mix Bazar.
          </p>

          {editing ? (
            <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
              {PROFILE_FIELDS.map((field) => (
                <div key={field.key}>
                  <label
                    htmlFor={`conta-${field.key}`}
                    className="text-sm font-medium text-gunmetal"
                  >
                    {field.label}
                  </label>

                  <input
                    id={`conta-${field.key}`}
                    type={field.inputType}
                    value={draft[field.key]}
                    onChange={(event) =>
                      setField(field.key, event.target.value)
                    }
                    className="mt-1.5 w-full rounded-input border border-input bg-background px-3 py-2.5 text-sm text-gunmetal outline-none placeholder:text-muted-foreground focus:border-jungle"
                  />
                </div>
              ))}

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={saveEdit}
                  data-helper="conta-salvar"
                >
                  Salvar dados
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setEditing(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <dl className="mt-8 divide-y divide-border rounded-card border border-border bg-background px-6 md:px-7">
              {PROFILE_FIELDS.map((field) => (
                <div
                  key={field.key}
                  className="flex flex-col gap-0.5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <dt className="text-sm text-pine">{field.label}</dt>
                  <dd className="text-sm font-medium text-gunmetal">
                    {profile[field.key]}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
