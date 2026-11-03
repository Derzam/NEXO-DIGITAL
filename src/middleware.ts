import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function applyAdminSecurityHeaders(res: NextResponse) {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return response;
  }

  // Security headers for administrative routes
  applyAdminSecurityHeaders(response);

  const url = process.env.NEXO_SUPABASE_URL;
  const key = process.env.NEXO_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) {
    // If unauthenticated and trying to access private admin route, redirect to login
    if (!isLoginPage) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      redirectUrl.searchParams.set("next", request.nextUrl.pathname);
      const redirectRes = NextResponse.redirect(redirectUrl);
      applyAdminSecurityHeaders(redirectRes);
      return redirectRes;
    }
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
        // Guarantee security headers are retained after cookie refresh
        applyAdminSecurityHeaders(response);
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isLoginPage && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    const redirectRes = NextResponse.redirect(redirectUrl);
    applyAdminSecurityHeaders(redirectRes);
    return redirectRes;
  }

  if (isLoginPage && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/resenas";
    redirectUrl.search = "";
    const redirectRes = NextResponse.redirect(redirectUrl);
    applyAdminSecurityHeaders(redirectRes);
    return redirectRes;
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
