"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { isPremiumRoute } from "@/lib/premium-routes";
export function RouteFooter({
  legacy,
  home,
  floating,
}: {
  legacy: ReactNode;
  home: ReactNode;
  floating: ReactNode;
}) {
  const isHome = isPremiumRoute(usePathname());
  return (
    <>
      {isHome ? home : legacy}
      {!isHome && floating}
    </>
  );
}
