import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { verifyToken } from "../../../lib/jwt";

export const dynamic = "force-dynamic";

// Fields the profile GET/PATCH is allowed to touch. `password` is
// deliberately never included here.
const PROFILE_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  addressLine1: true,
  addressLine2: true,
  city: true,
  state: true,
  country: true,
  postalCode: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

// Fields the client is allowed to update via PATCH. Anything else in
// the request body (userId, role, status, id, etc.) is ignored.
const UPDATABLE_FIELDS = [
  "name",
  "phone",
  "addressLine1",
  "addressLine2",
  "city",
  "state",
  "country",
  "postalCode",
  "image",
] as const;

type UpdatableField = (typeof UPDATABLE_FIELDS)[number];

/**
 * Step 1-3: Read the JWT cookie, verify it, and pull userId out of it.
 * Returns null if there's no valid session — callers respond 401.
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
// GET /api/profile — Step 4-5: fetch the caller's own profile
// ============================================================================
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: PROFILE_SELECT,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("GET /api/profile error:", err);

    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/profile — Step 6: update the caller's own profile
// ============================================================================
export async function PATCH(req: NextRequest) {
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

    // The client must never be trusted to say who it's updating.
    // We deliberately never read body.userId / body.id here — the
    // JWT-derived `userId` above is the only source of truth for
    // which row gets updated.
    const data: Prisma.UserUpdateInput = {};

    for (const field of UPDATABLE_FIELDS) {
      if (field in body) {
        const value = body[field];

        if (field === "name") {
          if (value !== null && value !== undefined) {
            data.name = String(value);
          }
        } else {
          (data as Record<string, string | null>)[field] = value;
        }
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    if (
      data.name !== undefined &&
      (data.name === null || !String(data.name).trim())
    ) {
      return NextResponse.json(
        { success: false, error: "Name cannot be empty" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select: PROFILE_SELECT,
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    console.error("PATCH /api/profile error:", err);

    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}