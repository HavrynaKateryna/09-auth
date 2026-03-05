import {
  NextRequest,
  NextResponse,
} from "next/server";
import { parse } from "cookie";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

type HeadersWithGetSetCookie = Headers & {
  getSetCookie?: () => string[];
};

const getSetCookieHeaders = (
  response: Response,
): string[] => {
  const headers =
    response.headers as HeadersWithGetSetCookie;

  if (
    typeof headers.getSetCookie === "function"
  ) {
    return headers.getSetCookie();
  }

  const single =
    response.headers.get("set-cookie");
  return single ? [single] : [];
};

const applySetCookieHeaders = (
  response: NextResponse,
  setCookies: string[],
) => {
  for (const cookieStr of setCookies) {
    const parsed = parse(cookieStr);
    const cookieName = Object.keys(parsed)[0];
    const cookieValue = cookieName
      ? parsed[cookieName]
      : undefined;

    if (
      !cookieName ||
      typeof cookieValue !== "string"
    )
      continue;

    response.cookies.set(
      cookieName,
      cookieValue,
      {
        expires: parsed.Expires
          ? new Date(parsed.Expires)
          : undefined,
        path: parsed.Path || "/",
        maxAge: parsed["Max-Age"]
          ? Number(parsed["Max-Age"])
          : undefined,
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    );
  }
};

export async function proxy(
  request: NextRequest,
) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(
    "accessToken",
  )?.value;
  const refreshToken = request.cookies.get(
    "refreshToken",
  )?.value;

  const isPublicRoute = publicRoutes.some(
    (route) => pathname.startsWith(route),
  );
  const isPrivateRoute = privateRoutes.some(
    (route) => pathname.startsWith(route),
  );

  if (!accessToken) {
    if (refreshToken) {
      try {
        const sessionResponse = await fetch(
          new URL(
            "/api/auth/session",
            request.url,
          ),
          {
            method: "GET",
            headers: {
              cookie:
                request.headers.get("cookie") ||
                "",
            },
            cache: "no-store",
          },
        );

        if (sessionResponse.ok) {
          const data =
            (await sessionResponse.json()) as {
              success?: boolean;
            };

          if (data.success) {
            const response = isPublicRoute
              ? NextResponse.redirect(
                  new URL(
                    "/profile",
                    request.url,
                  ),
                )
              : NextResponse.next();

            applySetCookieHeaders(
              response,
              getSetCookieHeaders(
                sessionResponse,
              ),
            );
            return response;
          }
        }
      } catch (error) {
        console.error(
          "Proxy session refresh failed:",
          error,
        );
      }
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(
        new URL("/sign-in", request.url),
      );
    }

    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.redirect(
      new URL("/profile", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
