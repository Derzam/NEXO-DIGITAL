// Expanded phase by phase; legacy routes retain their original shell until migrated.
export const premiumRoutes: readonly string[] = ["/", "/servicios"];

export function isPremiumRoute(pathname: string) {
  return premiumRoutes.some(
    (route) =>
      pathname === route || (route !== "/" && pathname.startsWith(route + "/")),
  );
}

export function navigationCurrent(
  pathname: string,
  href: string,
): "page" | "location" | undefined {
  if (pathname === href) return "page";
  return href !== "/" && pathname.startsWith(href + "/")
    ? "location"
    : undefined;
}
