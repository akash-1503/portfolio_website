import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { Role } from "@prisma/client";

// Route protection mappings based on rule constraints
const protectionRules: {
  prefix: string;
  allowedRoles: Role[];
}[] = [
  { prefix: "/super-admin", allowedRoles: [Role.SUPER_ADMIN] },
  { prefix: "/admin", allowedRoles: [Role.ADMIN] },
  { prefix: "/volunteer", allowedRoles: [Role.VOLUNTEER] },
  { prefix: "/user", allowedRoles: [Role.USER] },
  { prefix: "/api/super-admin", allowedRoles: [Role.SUPER_ADMIN] },
  { prefix: "/api/admin", allowedRoles: [Role.ADMIN] },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Identify if the current path requires verification
const rule = protectionRules.find((r) =>
  pathname.startsWith(r.prefix)
);
  
  if (!rule) {
    return NextResponse.next();
  }

  // 2. Read cookie ("token" name used in your login routing layout)
  const tokenCookie = request.cookies.get("token");
  const token = tokenCookie?.value;

  if (!token) {
    // Redirect to login if token is completely missing
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 3. Verify JWT (jose is optimized for edge-runtime environments)
  console.log("TOKEN:", token);
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

const secret = new TextEncoder().encode(jwtSecret);

const { payload } = await jwtVerify(token, secret);
console.log("PAYLOAD:", payload);
const userRole = payload.role as Role;

    // 4. Check if Role is Allowed for the requested prefix path
    if (!rule.allowedRoles.includes(userRole)) {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // 5. Authorized workflow → continue
    return NextResponse.next();

  } catch (error) {
    console.error("[MIDDLEWARE_JWT_ERROR]", error);

    // 6. Token invalid or expired → Clear cookie and bounce back to login layout
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("token", "", { path: "/", maxAge: 0 });
    return response;
  }
}

// Ensure the middleware executes explicitly over restricted layouts
export const config = {
  matcher: [
    "/super-admin/:path*",
    "/admin/:path*",
    "/volunteer/:path*",
    "/user/:path*",
    "/api/super-admin/:path*",
    "/api/admin/:path*",
  ],
};