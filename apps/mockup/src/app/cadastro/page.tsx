"use client";

import { useCustomer } from "@/context/customer";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@repo/ui";

function isValidEmail(value: string) {
  return /.+@.+\..+/.test(value.trim());
}

export default function CadastroPage() {
  const { login, profile, updateProfile } = useCustomer();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: { name?: string; email?: string; password?: string } =
      {};

    if (name.trim().length === 0) {
      nextErrors.name = "Digite seu nome.";
    }

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

    updateProfile({
      ...profile,
      name: name.trim(),
      email: email.trim(),
    });
    login();
    router.push("/conta");
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="grid min-h-svh lg:grid-cols-[70%_30%]">
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1400&q=90"
            alt="Presente embalado do Mix Bazar"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-gunmetal/80 via-gunmetal/10 to-transparent" />

          <div className="absolute inset-x-10 bottom-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lime">
              Mix Bazar
            </p>

            <p className="mt-2 max-w-md whitespace-nowrap font-heading text-2xl font-semibold text-platinum md:text-3xl">
              Um presente para cada ocasião.
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
              Criar conta
            </h1>

            <p className="mt-1 whitespace-nowrap text-sm leading-6 text-pine/70">
              Crie sua conta para continuar.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8 grid gap-4"
            >
              <div>
                <label
                  htmlFor="cadastro-name"
                  className="text-sm font-medium text-gunmetal"
                >
                  Nome
                </label>

                <input
                  id="cadastro-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-invalid={errors.name !== undefined}
                  className="mt-1.5 w-full rounded-input border border-input bg-background px-3 py-2.5 text-sm text-gunmetal outline-none placeholder:text-muted-foreground focus:border-jungle"
                  placeholder="Seu nome"
                />

                {errors.name && (
                  <p role="alert" className="mt-1.5 text-xs text-danger-text">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cadastro-email"
                  className="text-sm font-medium text-gunmetal"
                >
                  E-mail
                </label>

                <input
                  id="cadastro-email"
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
                  htmlFor="cadastro-password"
                  className="text-sm font-medium text-gunmetal"
                >
                  Senha
                </label>

                <input
                  id="cadastro-password"
                  type="password"
                  autoComplete="new-password"
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

              <Button
                type="submit"
                variant="primary"
                size="xl"
                icon={<ArrowRight size={17} />}
                className="mt-2 w-full"
              >
                Criar minha conta
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-pine">
              Já tem conta?{" "}
              <Link
                href="/login"
                className="font-medium text-jungle transition hover:text-pine"
              >
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
