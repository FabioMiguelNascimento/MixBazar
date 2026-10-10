"use client";

import {
  ArrowRight,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useState, type FormEvent } from "react";

function isValidEmail(value: string) {
  return /.+@.+\..+/.test(value.trim());
}

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setError("Digite um e-mail válido.");
      return;
    }

    setError(null);
    setSent(true);
  }

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <Link
          href="/home"
          aria-label="Mix Bazar"
          className="flex items-center gap-2.5"
        >
          <img
            src="/mockup/LogoMix.svg"
            alt="Mix Bazar"
            className="h-10 w-auto object-contain"
          />

          <span className="font-heading text-lg font-semibold text-gunmetal">
            Bazar
          </span>
        </Link>

        <div className="mt-10">
          {sent ? (
            <div className="flex flex-col items-center text-center">
              <CheckCircle size={56} weight="duotone" className="text-jungle" />

              <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-gunmetal md:text-3xl">
                Verifique seu e-mail
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-6 text-pine/70">
                Enviamos um link de recuperação para {email.trim()}.
              </p>

              <Link
                href="/login"
                className="mt-7 inline-flex items-center gap-2 rounded-button bg-jungle px-6 py-3.5 text-sm font-medium text-platinum transition hover:bg-primary-hover active:bg-primary-active"
              >
                Voltar ao login
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-gunmetal">
                Recuperar senha
              </h1>

              <p className="mt-3 text-sm leading-6 text-pine/70">
                Digite seu e-mail para receber o link de recuperação.
              </p>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-8 grid gap-4"
              >
                <div>
                  <label
                    htmlFor="recuperar-email"
                    className="text-sm font-medium text-gunmetal"
                  >
                    E-mail
                  </label>

                  <input
                    id="recuperar-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={error !== null}
                    className="mt-1.5 w-full rounded-input border border-input bg-background px-3 py-2.5 text-sm text-gunmetal outline-none placeholder:text-muted-foreground focus:border-jungle"
                    placeholder="voce@example.com"
                  />

                  {error && (
                    <p role="alert" className="mt-1.5 text-xs text-danger-text">
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-button bg-jungle px-6 py-4 text-sm font-medium text-platinum transition hover:bg-primary-hover active:bg-primary-active"
                >
                  Enviar link
                  <ArrowRight size={17} />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-pine">
                Lembrou a senha?{" "}
                <Link
                  href="/login"
                  className="font-medium text-jungle transition hover:text-pine"
                >
                  Entrar
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
