import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  actionHref,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
          {title}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-pine/70 md:text-base">
          {description}
        </p>
      </div>

      {action &&
        (actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-jungle transition hover:text-pine"
          >
            {action}
            <ArrowRight size={15} />
          </Link>
        ) : (
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-jungle transition hover:text-pine"
          >
            {action}
            <ArrowRight size={15} />
          </button>
        ))}
    </div>
  );
}
