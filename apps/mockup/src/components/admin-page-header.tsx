export function AdminPageHeader({ actions }: { actions?: React.ReactNode }) {
  if (!actions) return null;

  return (
    <div className="flex min-w-0 flex-wrap items-center justify-end gap-3">
      {actions}
    </div>
  );
}
