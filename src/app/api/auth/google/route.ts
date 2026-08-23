import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId) {
      return NextResponse.json(
        {
          success: false,
          message: "GOOGLE_CLIENT_ID is not configured.",
        },
        { status: 500 }
      );
    }

    if (!redirectUri) {
      return NextResponse.json(
        {
          success: false,
          message: "GOOGLE_REDIRECT_URI is not configured.",
        },
        { status: 500 }
      );
    }

    /*
     * State protects the OAuth flow against CSRF.
     */
    const state = crypto.randomBytes(32).toString("hex");

    const googleUrl = new URL(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );

    googleUrl.searchParams.set("client_id", clientId);

    googleUrl.searchParams.set(
      "redirect_uri",
      redirectUri
    );

    googleUrl.searchParams.set(
      "response_type",
      "code"
    );

    /*
     * We only need basic identity information.
     */
    googleUrl.searchParams.set(
      "scope",
      "openid email profile"
    );

    googleUrl.searchParams.set(
      "access_type",
      "online"
    );

    googleUrl.searchParams.set(
      "prompt",
      "select_account"
    );

    googleUrl.searchParams.set(
      "state",
      state
    );

    const response = NextResponse.redirect(
      googleUrl.toString()
    );

    /*
     * Store OAuth state in an HTTP-only cookie.
     */
    response.cookies.set(
      "google_oauth_state",
      state,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 10 * 60,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "GOOGLE OAUTH START ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to start Google authentication.",
      },
      { status: 500 }
    );
  }
}