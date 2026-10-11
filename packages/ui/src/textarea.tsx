import * as React from "react";
import { cn } from "cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full min-w-0 rounded-input border border-input bg-background px-3 py-2 text-sm text-gunmetal transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-jungle disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger-text",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
