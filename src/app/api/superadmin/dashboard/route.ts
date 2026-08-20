import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/jwt";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // ==========================================
    // AUTHENTICATION
    // ==========================================

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    let payload;

    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    // ==========================================
    // SUPER ADMIN CHECK
    // ==========================================

    if (payload.role !== Role.SUPER_ADMIN) {
      return NextResponse.json(
        {
          success: false,
          message: "Super Admin access required.",
        },
        { status: 403 }
      );
    }

    // ==========================================
    // VERIFY SUPER ADMIN
    // ==========================================

    const superAdmin = await prisma.user.findFirst({
      where: {
        id: payload.id,
        role: Role.SUPER_ADMIN,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!superAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Super Admin not found.",
        },
        { status: 403 }
      );
    }

    // ==========================================
    // FETCH DASHBOARD DATA
    // ==========================================

    const [
      totalNGOs,
      totalAdmins,
      totalUsers,
      activeEvents,
      activeCampaigns,
      unresolvedErrors,
      recentErrors,
    ] = await Promise.all([
      prisma.nGO.count({
        where: {
          isDeleted: false,
        },
      }),

      prisma.user.count({
        where: {
          role: Role.ADMIN,
          isDeleted: false,
        },
      }),

      prisma.user.count({
        where: {
          role: Role.USER,
          isDeleted: false,
        },
      }),

      prisma.event.count({
        where: {
          status: "ACTIVE",
          isDeleted: false,
        },
      }),

      prisma.campaign.count({
        where: {
          status: "ACTIVE",
          isDeleted: false,
        },
      }),

      prisma.systemError.count({
        where: {
          resolved: false,
        },
      }),

      prisma.systemError.findMany({
  where: {
    resolved: false,
  },

  orderBy: {
    createdAt: "desc",
  },

  take: 5,

  select: {
  id: true,
  errorType: true,
  message: true,
  endpoint: true,
  method: true,
  statusCode: true,
  severity: true,
  resolved: true,
  createdAt: true,
}
})
]);

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json({
      success: true,

      data: {
        stats: {
          totalNGOs,
          totalAdmins,
          totalUsers,
          activeEvents,
          activeCampaigns,
          unresolvedErrors,
        },

        recentErrors,
      },
    });

  } catch (error) {
    console.error(
      "SUPER ADMIN DASHBOARD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load Super Admin dashboard.",
      },
      { status: 500 }
    );
  }
}