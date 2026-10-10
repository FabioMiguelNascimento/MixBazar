"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCustomer } from "@/context/customer";

function isValidEmail(value: string) {
  return /.+@.+\..+/.test(value.trim());
}

export default function LoginPage() {
  const { login } = useCustomer();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: { email?: string; password?: string } = {};

    if (!isValidEmail(email)) {
      nextErrors.email = "Digite um e-mail válido.";
    }

    if (password.length < 4) {
      nextErrors.password = "A senha precisa de ao menos 4 caracteres.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    login();
    router.push("/conta");
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="grid min-h-svh lg:grid-cols-[70%_30%]">
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1400&q=90"
            alt="Cesta personalizada do Mix Bazar"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-gunmetal/80 via-gunmetal/10 to-transparent" />

          <div className="absolute inset-x-10 bottom-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lime">
              Mix Bazar
            </p>

            <p className="mt-2 max-w-md whitespace-nowrap font-heading text-2xl font-semibold text-platinum md:text-3xl">
              Monte sua cesta do seu jeito.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-16 md:py-20">
          <div className="w-full max-w-sm">
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

            <h1 className="mt-8 font-heading text-3xl font-semibold tracking-tight text-gunmetal">
              Bem-vindo de volta
            </h1>

            <p className="mt-3 text-sm leading-6 text-pine/70">
              Entre na sua conta para continuar.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8 grid gap-4"
            >
              <div>
                <label
                  htmlFor="login-email"
                  className="text-sm font-medium text-gunmetal"
                >
                  E-mail
                </label>

                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={errors.email !== undefined}
                  className="mt-1.5 w-full rounded-input border border-input bg-background px-3 py-2.5 text-sm text-gunmetal outline-none placeholder:text-muted-foreground focus:border-jungle"
                  placeholder="voce@example.com"
                />

                {errors.email && (
                  <p role="alert" className="mt-1.5 text-xs text-danger-text">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="text-sm font-medium text-gunmetal"
                >
                  Senha
                </label>

                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={errors.password !== undefined}
                  className="mt-1.5 w-full rounded-input border border-input bg-background px-3 py-2.5 text-sm text-gunmetal outline-none placeholder:text-muted-foreground focus:border-jungle"
                  placeholder="••••••"
                />

                {errors.password && (
                  <p role="alert" className="mt-1.5 text-xs text-danger-text">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-button bg-jungle px-6 py-4 text-sm font-medium text-platinum transition hover:bg-primary-hover active:bg-primary-active"
              >
                Entrar
                <ArrowRight size={17} />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
              <Link
                href="/cadastro"
                className="font-medium text-jungle transition hover:text-pine"
              >
                Criar conta
              </Link>

              <Link
                href="/recuperar"
                className="font-medium text-jungle transition hover:text-pine"
              >
                Esqueci a senha
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
