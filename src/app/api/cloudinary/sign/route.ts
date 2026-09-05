import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

import { verifyToken } from "../../../../lib/jwt";
import { prisma } from "../../../../lib/prisma";
import cloudinary from "../../../../lib/cloudinary";

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
          message: "Administrator is not associated with an NGO.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 5. Read Cloudinary parameters
    // --------------------------------------------------
    const body = await req.json();

    const paramsToSign = body?.paramsToSign;

    console.log(
      "Cloudinary params received:",
      JSON.stringify(paramsToSign, null, 2)
    );

    if (
      !paramsToSign ||
      typeof paramsToSign !== "object" ||
      Array.isArray(paramsToSign)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Cloudinary signature parameters.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 6. Sign EXACTLY what Cloudinary sent
    // --------------------------------------------------
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    // --------------------------------------------------
    // 7. Return signature
    // --------------------------------------------------
    return NextResponse.json({
      success: true,
      signature,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("CLOUDINARY SIGNATURE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate Cloudinary upload signature.",
      },
      { status: 500 }
    );
  }
}