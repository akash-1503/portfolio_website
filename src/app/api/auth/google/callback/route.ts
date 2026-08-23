import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { Role } from "@prisma/client";
import { generateToken } from "../../../../../lib/jwt";

interface GoogleTokenResponse {
  access_token?: string;
  id_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const googleError = url.searchParams.get("error");

    /*
     * -------------------------------------------------------
     * 1. GOOGLE ERROR
     * -------------------------------------------------------
     */

    if (googleError) {
      console.error(
        "GOOGLE OAUTH ERROR:",
        googleError
      );

      return NextResponse.redirect(
        new URL(
          "/login?error=google_auth_failed",
          req.url
        )
      );
    }

    /*
     * -------------------------------------------------------
     * 2. CHECK CODE
     * -------------------------------------------------------
     */

    if (!code) {
      return NextResponse.redirect(
        new URL(
          "/login?error=missing_google_code",
          req.url
        )
      );
    }

    /*
     * -------------------------------------------------------
     * 3. CHECK STATE
     * -------------------------------------------------------
     */

    const savedState =
      req.cookies.get(
        "google_oauth_state"
      )?.value;

    if (
      !state ||
      !savedState ||
      state !== savedState
    ) {
      console.error(
        "GOOGLE OAUTH STATE MISMATCH"
      );

      return NextResponse.redirect(
        new URL(
          "/login?error=invalid_google_state",
          req.url
        )
      );
    }

    /*
     * -------------------------------------------------------
     * 4. ENVIRONMENT VARIABLES
     * -------------------------------------------------------
     */

    const clientId =
      process.env.GOOGLE_CLIENT_ID;

    const clientSecret =
      process.env.GOOGLE_CLIENT_SECRET;

    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI;

    if (
      !clientId ||
      !clientSecret ||
      !redirectUri
    ) {
      console.error(
        "Google OAuth environment variables are missing."
      );

      return NextResponse.redirect(
        new URL(
          "/login?error=google_configuration_error",
          req.url
        )
      );
    }

    /*
     * -------------------------------------------------------
     * 5. EXCHANGE AUTHORIZATION CODE
     * -------------------------------------------------------
     */

    const tokenResponse =
      await fetch(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type:
              "authorization_code",
          }).toString(),

          cache: "no-store",
        }
      );

    const tokenData =
      (await tokenResponse.json()) as GoogleTokenResponse;

    if (
      !tokenResponse.ok ||
      !tokenData.access_token
    ) {
      console.error(
        "GOOGLE TOKEN EXCHANGE ERROR:",
        tokenData
      );

      return NextResponse.redirect(
        new URL(
          "/login?error=google_token_failed",
          req.url
        )
      );
    }

    /*
     * -------------------------------------------------------
     * 6. GET GOOGLE USER INFORMATION
     * -------------------------------------------------------
     */

    const googleUserResponse =
      await fetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },

          cache: "no-store",
        }
      );

    const googleUser =
      (await googleUserResponse.json()) as GoogleUserInfo;

    if (
      !googleUserResponse.ok ||
      !googleUser.email
    ) {
      console.error(
        "GOOGLE USER INFO ERROR:",
        googleUser
      );

      return NextResponse.redirect(
        new URL(
          "/login?error=google_user_failed",
          req.url
        )
      );
    }

    /*
     * -------------------------------------------------------
     * 7. GOOGLE EMAIL MUST BE VERIFIED
     * -------------------------------------------------------
     */

    if (!googleUser.email_verified) {
      return NextResponse.redirect(
        new URL(
          "/login?error=google_email_not_verified",
          req.url
        )
      );
    }

    const email =
      googleUser.email
        .trim()
        .toLowerCase();
// -------------------------------------------------------
// SINGLE NGO CONFIGURATION
// -------------------------------------------------------

const ngo = await prisma.nGO.findFirst({
  select: {
    id: true,
    name: true,
  },
});

if (!ngo) {
  console.error("NO NGO FOUND IN DATABASE");

  return NextResponse.redirect(
    new URL(
      "/login?error=ngo_not_configured",
      req.url
    )
  );
}
    /*
     * -------------------------------------------------------
     * 8. FIND EXISTING USER
     * -------------------------------------------------------
     */

    let user =
      await prisma.user.findUnique({
        where: {
          email,
        },

        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          role: true,
          status: true,
          ngoId: true,
          isDeleted: true,
        },
      });

    /*
     * -------------------------------------------------------
     * 9. EXISTING USER
     * -------------------------------------------------------
     */

  if (user) {
  // ---------------------------------------------
  // Deleted account
  // ---------------------------------------------

  if (user.isDeleted) {
    return NextResponse.redirect(
      new URL(
        "/login?error=account_deleted",
        req.url
      )
    );
  }

  // ---------------------------------------------
  // Inactive account
  // ---------------------------------------------

  if (String(user.status) !== "ACTIVE") {
    return NextResponse.redirect(
      new URL(
        "/login?error=account_inactive",
        req.url
      )
    );
  }

  // ---------------------------------------------
  // NGO association check
  // ---------------------------------------------

  if (
    user.ngoId &&
    user.ngoId !== ngo.id
  ) {
    console.error(
      "USER ASSOCIATED WITH DIFFERENT NGO",
      {
        userId: user.id,
        userNgoId: user.ngoId,
        currentNgoId: ngo.id,
      }
    );

    return NextResponse.redirect(
      new URL(
        "/login?error=invalid_ngo_association",
        req.url
      )
    );
  }

  // ---------------------------------------------
  // Update existing user
  // ---------------------------------------------

  user = await prisma.user.update({
    where: {
      id: user.id,
    },

    data: {
      ...(googleUser.picture
        ? {
            image: googleUser.picture,
          }
        : {}),

      ...(googleUser.name && !user.name
        ? {
            name: googleUser.name,
          }
        : {}),

      // IMPORTANT:
      // Existing users with no NGO get
      // automatically assigned to the single NGO.
      ...(user.ngoId === null
        ? {
            ngoId: ngo.id,
          }
        : {}),

      emailVerified: new Date(),
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      status: true,
      ngoId: true,
      isDeleted: true,
    },
  });
}

    /* -------------------------------------------------------
 * 10. NEW GOOGLE USER
 * -------------------------------------------------------
 */

if (!user) {
  user = await prisma.user.create({
    data: {
      name:
        googleUser.name ||
        email.split("@")[0],

      email,

      password: null,

      image:
        googleUser.picture || null,

      role: Role.USER,

      // Single NGO
      ngoId: ngo.id,

      emailVerified: new Date(),

      isDeleted: false,
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      status: true,
      ngoId: true,
      isDeleted: true,
    },
  });
}
    /*
     * -------------------------------------------------------
     * 11. GENERATE YOUR EXISTING JWT
     * -------------------------------------------------------
     */

    const jwtToken = generateToken({
  id: user.id,
  email: user.email,
  role: user.role,
  ngoId: user.ngoId,
});

    /*
     * -------------------------------------------------------
     * 12. DETERMINE DASHBOARD
     * -------------------------------------------------------
     */

    let dashboard = "/dashboard";

    switch (user.role) {
      case Role.SUPER_ADMIN:
        dashboard = "/superadmin";
        break;

      case Role.ADMIN:
        dashboard = "/admin";
        break;

      case Role.VOLUNTEER:
        dashboard = "/volunteer";
        break;

      case Role.USER:
      default:
        dashboard = "/user";
        break;
    }

    /*
     * -------------------------------------------------------
     * 13. REDIRECT
     * -------------------------------------------------------
     */

    const response =
      NextResponse.redirect(
        new URL(
          dashboard,
          req.url
        )
      );

    /*
     * -------------------------------------------------------
     * 14. SET YOUR EXISTING TOKEN COOKIE
     * -------------------------------------------------------
     */

    response.cookies.set(
      "token",
      jwtToken,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        /*
         * 7 days.
         *
         * Change this if your existing
         * login cookie uses another duration.
         */
        maxAge:
          7 * 24 * 60 * 60,
      }
    );

    /*
     * Remove OAuth state cookie.
     */
    response.cookies.delete(
      "google_oauth_state"
    );

    return response;
  } catch (error) {
    console.error(
      "GOOGLE OAUTH CALLBACK ERROR:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/login?error=google_login_failed",
        req.url
      )
    );
  }
}