export function AdminPageHeader({
  eyebrow,
  title,
  actions,
}: {
  eyebrow: string;
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jungle">
        {eyebrow}
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="min-w-0 font-heading text-3xl font-semibold tracking-tight text-gunmetal md:text-4xl">
          {title}
        </h1>
        {actions}
      </div>
    </div>
  );
}
