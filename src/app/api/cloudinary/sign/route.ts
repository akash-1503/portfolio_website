import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

import { verifyToken } from "../../../../lib/jwt";
import { prisma } from "../../../../lib/prisma";
import cloudinary from "../../../../lib/cloudinary";

import {
  ALLOWED_CLOUDINARY_FOLDERS,
} from "../../../../lib/cloudinary-folders";

export async function POST(req: Request) {
  try {
    // --------------------------------------------------
    // 1. Get authentication token
    // --------------------------------------------------

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // 2. Verify JWT
    // --------------------------------------------------

    let payload;

    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired authentication token.",
        },
        { status: 401 }
      );
    }

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authentication token.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // 3. Only ADMIN can upload
    // --------------------------------------------------

    if (payload.role !== Role.ADMIN) {
      return NextResponse.json(
        {
          success: false,
          message: "Only administrators can upload media.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 4. Verify admin from database
    // --------------------------------------------------

    const admin = await prisma.user.findFirst({
      where: {
        id: payload.id,
        role: Role.ADMIN,
        isDeleted: false,
      },
      select: {
        id: true,
        ngoId: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Administrator account not found.",
        },
        { status: 403 }
      );
    }

    if (!admin.ngoId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Administrator is not associated with an NGO.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 5. Read request body
    // --------------------------------------------------

    const body = await req.json();

    const paramsToSign = body?.paramsToSign;

    if (
      !paramsToSign ||
      typeof paramsToSign !== "object" ||
      Array.isArray(paramsToSign)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Cloudinary signature parameters.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 6. Validate Cloudinary folder
    // --------------------------------------------------

  const folder = paramsToSign.folder;

if (
  typeof folder !== "string" ||
  !ALLOWED_CLOUDINARY_FOLDERS.has(
    folder as Parameters<typeof ALLOWED_CLOUDINARY_FOLDERS.has>[0]
  )
) {
  return NextResponse.json(
    { error: "Invalid Cloudinary folder" },
    { status: 400 }
  );
}

    // --------------------------------------------------
    // 7. Validate timestamp
    // --------------------------------------------------

    if (
      typeof paramsToSign.timestamp !== "number" &&
      typeof paramsToSign.timestamp !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Cloudinary timestamp.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 8. Validate upload preset
    // --------------------------------------------------

    if (
      paramsToSign.upload_preset !==
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Cloudinary upload preset.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 9. Generate Cloudinary signature
    // --------------------------------------------------

    const apiSecret =
      process.env.CLOUDINARY_API_SECRET;

    if (!apiSecret) {
      console.error(
        "CLOUDINARY_API_SECRET is not configured."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Cloudinary server configuration is incomplete.",
        },
        { status: 500 }
      );
    }

    const signature =
      cloudinary.utils.api_sign_request(
        paramsToSign,
        apiSecret
      );

    // --------------------------------------------------
    // 10. Return signature
    // --------------------------------------------------

    return NextResponse.json({
      success: true,
      signature,
      apiKey:
        process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error(
      "CLOUDINARY SIGNATURE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to generate Cloudinary upload signature.",
      },
      { status: 500 }
    );
  }
}