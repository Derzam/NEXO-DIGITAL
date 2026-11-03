import type { NextRequest } from "next/server";

/**
 * Validates request origin and referer to protect administrative endpoints
 * against CSRF and unauthorized cross-site manipulation.
 */
export function isValidAdminOrigin(request: NextRequest): boolean {
  // 1. Reject explicit cross-site navigation/fetch requests
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  const allowed = new Set<string>();
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
    } catch {}
  }
  if (process.env.VERCEL_URL) {
    allowed.add("https://" + process.env.VERCEL_URL);
  }

  // Local development and test environments
  allowed.add("http://localhost:3000");
  allowed.add("http://127.0.0.1:3000");
  allowed.add("http://127.0.0.1:3100");
  allowed.add("http://localhost:3100");

  if (origin) {
    return allowed.has(origin);
  }

  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      return allowed.has(refererOrigin);
    } catch {
      return false;
    }
  }

  // If neither Origin nor Referer is provided (e.g. non-browser clients, automated test runners,
  // server-to-server calls), allow the request to proceed to authentication.
  return true;
}
