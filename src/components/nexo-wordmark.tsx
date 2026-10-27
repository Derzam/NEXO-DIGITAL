import Image from "next/image";
import { cn } from "@/lib/utils";

export function NexoWordmark({
  className,
  eager = false,
}: {
  className?: string;
  eager?: boolean;
}) {
  return (
    <Image
      src="/images/nexo-wordmark.webp"
      alt=""
      width={1200}
      height={312}
      unoptimized
      loading={eager ? "eager" : "lazy"}
      className={cn(
        "tw:h-auto tw:w-[200px] tw:shrink-0 tw:mix-blend-screen tw:max-sm:w-[170px]",
        className,
      )}
    />
  );
}
