"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
export function RouteFooter({
  legacy,
  home,
  floating,
}: {
  legacy: ReactNode;
  home: ReactNode;
  floating: ReactNode;
}) {
  const isHome = usePathname() === "/";
  return (
    <>
      {isHome ? home : legacy}
      {!isHome && floating}
    </>
  );
}
