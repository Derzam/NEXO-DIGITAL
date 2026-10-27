import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// shadcn native control, adapted to the existing prefixed Tailwind theme.
export const fieldClassName = "tw:box-border tw:w-full tw:min-w-0 tw:rounded-lg tw:border tw:border-input tw:bg-background tw:px-4 tw:py-3 tw:text-[16px] tw:leading-normal tw:text-foreground tw:outline-none tw:transition-colors tw:placeholder:text-muted-foreground tw:focus-visible:border-ring tw:focus-visible:ring-[3px] tw:focus-visible:ring-ring/30 tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:aria-invalid:border-destructive tw:aria-invalid:ring-destructive/20";

export function Input({ className, type, ...props }: ComponentProps<"input">) {
  return <input data-slot="input" type={type} className={cn(fieldClassName, "tw:h-13", className)} {...props} />;
}
