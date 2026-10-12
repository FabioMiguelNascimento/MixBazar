export function AdminPageHeader({ actions }: { actions?: React.ReactNode }) {
  if (!actions) return null;

  return (
    <div className="min-w-0">
      <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
        {actions}
      </div>
    </div>
  );
}
