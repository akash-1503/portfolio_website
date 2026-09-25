import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/jwt";

export const dynamic = "force-dynamic";

const MIN_PASSWORD_LENGTH = 8;

/**
 * Read the JWT cookie, verify it, and pull userId out of it.
 * Returns null if there's no valid session — caller responds 401.
 */
async function getAuthenticatedUserId(
  req: NextRequest
): Promise<string | null> {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload: any = await verifyToken(token);
    return payload?.id ?? payload?.userId ?? null;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

// ============================================================================
// POST /api/profile/password — change the caller's own password
// ============================================================================
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body: Record<string, any>;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const currentPassword: string | undefined = body?.currentPassword;
    const newPassword: string | undefined = body?.newPassword;
    const confirmPassword: string | undefined = body?.confirmPassword;

    // --- Presence checks ---
    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: "Current password is required." },
        { status: 400 }
      );
    }

    if (!newPassword) {
      return NextResponse.json(
        { success: false, error: "New password is required." },
        { status: 400 }
      );
    }

    if (!confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Please confirm your new password." },
        { status: 400 }
      );
    }

    // --- New password validation ---
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "New password and confirm password do not match.",
        },
        { status: 400 }
      );
    }

    // --- Load the user's current password hash ---
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.password) {
      // Account has no password set (e.g. social/OAuth-only login).
      return NextResponse.json(
        {
          success: false,
          error: "Password login is not enabled for this account.",
        },
        { status: 400 }
      );
    }

const isValid = await bcrypt.compare(currentPassword, user.password);

if (!isValid) {
  return NextResponse.json(
    {
      success: false,
      error: "Current password is incorrect.",
    },
    { status: 400 }
  );
}

const isSamePassword = await bcrypt.compare(
  newPassword,
  user.password
);

if (isSamePassword) {
  return NextResponse.json(
    {
      success: false,
      error: "New password must be different from your current password.",
    },
    { status: 400 }
  );
}

    // --- Hash and store the new password ---
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error("POST /api/profile/password error:", err);

    return NextResponse.json(
      { success: false, error: "Failed to update password" },
      { status: 500 }
    );
  }
}