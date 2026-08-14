import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const DEV_COOKIE = "lbm_dev_session";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  /*
   * =========================================================
   * LBMOS ROUTES
   * =========================================================
   */

  const isOsRoute =
    pathname === "/os" || pathname.startsWith("/os/");

  const isLoginRoute =
    pathname === "/os/login";

  const isResetPasswordRoute =
    pathname === "/os/reset-password";

  const isPublicOsRoute =
    isLoginRoute || isResetPasswordRoute;

  /*
   * Anything outside /os does not need LBMOS authentication.
   */
  if (!isOsRoute) {
    return NextResponse.next();
  }

  /*
   * =========================================================
   * IMPORTANT:
   * LOGIN AND PASSWORD RESET ARE ALWAYS PUBLIC
   * =========================================================
   *
   * This prevents the login page from being redirected
   * back into the Command Centre by middleware.
   *
   * Authentication is handled by LoginForm.tsx.
   */

  if (isPublicOsRoute) {
    return NextResponse.next();
  }

  /*
   * =========================================================
   * LOCAL DEVELOPMENT BYPASS
   * =========================================================
   *
   * Only available while running:
   *
   * npm run dev
   *
   * This does NOT work in production.
   */

  if (process.env.NODE_ENV === "development") {
    const devSession =
      request.cookies.get(DEV_COOKIE);

    if (devSession?.value === "1") {
      return NextResponse.next();
    }
  }

  /*
   * =========================================================
   * SUPABASE SERVER CLIENT
   * =========================================================
   */

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(
                name,
                value
              );
            }
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  /*
   * =========================================================
   * CHECK AUTHENTICATED SUPABASE USER
   * =========================================================
   */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * =========================================================
   * PROTECT THE LBMOS APPLICATION
   * =========================================================
   *
   * If someone tries to access:
   *
   * /os
   * /os/leads
   * /os/clients
   * /os/projects
   * /os/bookings
   * /os/settings
   * etc.
   *
   * without authentication, send them to:
   *
   * /os/login?next=/requested-page
   */

  if (!user) {
    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname = "/os/login";

    loginUrl.search = "";

    loginUrl.searchParams.set(
      "next",
      pathname
    );

    return NextResponse.redirect(
      loginUrl
    );
  }

  /*
   * =========================================================
   * AUTHENTICATED REQUEST
   * =========================================================
   */

  return response;
}

/*
 * =========================================================
 * LBMOS MIDDLEWARE MATCHER
 * =========================================================
 */

export const config = {
  matcher: [
    "/os",
    "/os/:path*",
  ],
};