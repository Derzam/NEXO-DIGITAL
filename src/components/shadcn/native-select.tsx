import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldClassName } from "@/components/shadcn/input";

// The official shadcn Native Select keeps native validation, keyboard and mobile pickers.
export function NativeSelect({ className, children, ...props }: ComponentProps<"select">) {
  return <div data-slot="native-select-wrapper" className="tw:relative tw:w-full">
    <select data-slot="native-select" className={cn(fieldClassName, "tw:h-13 tw:appearance-none tw:pr-10", className)} {...props}>{children}</select>
    <ChevronDown className="tw:pointer-events-none tw:absolute tw:right-4 tw:top-1/2 tw:size-4 tw:-translate-y-1/2 tw:text-muted-foreground" aria-hidden="true" />
  </div>;
}

export function NativeSelectOption(props: ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />;
}
