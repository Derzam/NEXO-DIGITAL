import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { fieldClassName } from "@/components/shadcn/input";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(fieldClassName, "tw:min-h-40 tw:resize-y", className)} {...props} />;
}
