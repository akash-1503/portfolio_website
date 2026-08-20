import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/jwt";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // =====================================================
    // 1. AUTHENTICATION
    // =====================================================

    const token = req.cookies.get("token")?.value;

    console.log("========== EVENT/CAMPAIGN API ==========");
    console.log("TOKEN EXISTS:", !!token);
    console.log("TOKEN LENGTH:", token?.length ?? 0);

    if (!token) {
      console.log("❌ TOKEN COOKIE NOT FOUND");

      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - token cookie missing",
        },
        { status: 401 }
      );
    }

    let payload;

    try {
      payload = verifyToken(token);

      console.log("✅ JWT VERIFIED");
      console.log("JWT USER ID:", payload.id);
      console.log("JWT ROLE:", payload.role);
      console.log("JWT NGO ID:", payload.ngoId);
    } catch (error) {
      console.error("❌ JWT VERIFICATION FAILED:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - invalid token",
        },
        { status: 401 }
      );
    }

    // =====================================================
    // 2. VERIFY ACTUAL USER & NGO
    // =====================================================

    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
        ngoId: payload.ngoId,
        role: Role.USER,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        ngoId: true,
      },
    });

    if (!user) {
      console.log("❌ USER NOT FOUND");

      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Invalid user.",
        },
        { status: 403 }
      );
    }

    if (!user.ngoId) {
      return NextResponse.json(
        {
          success: false,
          message: "No NGO association found.",
        },
        { status: 400 }
      );
    }

    console.log("✅ USER VERIFIED");
    console.log("USER ID:", user.id);
    console.log("NGO ID:", user.ngoId);

    // =====================================================
    // 3. FETCH EVENTS & CAMPAIGNS
    // =====================================================

    const [events, campaigns] = await Promise.all([
      // ===================================================
      // FETCH EVENTS
      // ===================================================

      prisma.event.findMany({
        where: {
          ngoId: user.ngoId,
          isDeleted: false,
          status: {
            in: ["UPCOMING", "ACTIVE"],
          },
        },

        orderBy: {
          startDate: "asc",
        },

        select: {
          id: true,
          title: true,
          status: true,
          summary: true,
          description: true,
          venue: true,
          address: true,
          city: true,
          startDate: true,
          endDate: true,
          registrationDeadline: true,
          coverImage: true,
          maxParticipants: true,
          programId: true,

          _count: {
            select: {
              eventRegistrations: true,
            },
          },

          program: {
            select: {
              id: true,
              name: true,
            },
          },

          eventRegistrations: {
            where: {
              userId: user.id,
            },

            select: {
              id: true,
              registeredAt: true,
            },
          },
        },
      }),

      // ===================================================
      // FETCH CAMPAIGNS
      // ===================================================

      prisma.campaign.findMany({
        where: {
          ngoId: user.ngoId,
          isDeleted: false,
          status: "ACTIVE",
        },

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          title: true,
          description: true,
          goalAmount: true,
          raisedAmount: true,
          status: true,
          coverImage: true,
          startDate: true,
          endDate: true,

          program: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    console.log("✅ EVENTS FETCHED:", events.length);
    console.log("✅ CAMPAIGNS FETCHED:", campaigns.length);

    // =====================================================
    // 4. TRANSFORM EVENTS DATA
    // =====================================================

    const formattedEvents = events.map((event) => {
      const isRegistered = event.eventRegistrations.length > 0;

      const participants = event._count.eventRegistrations;

      const frontendStatus =
        event.status === "ACTIVE"
          ? "ONGOING"
          : "UPCOMING";

      const location = [
        event.venue,
        event.address,
        event.city,
      ]
        .filter(Boolean)
        .join(", ");

      const description =
        event.description ||
        event.summary ||
        "More information about this event will be available soon.";

      const now = new Date();

     const canRegister =
  (event.status === "UPCOMING" || event.status === "ACTIVE") &&
  (!event.registrationDeadline ||
    now <= event.registrationDeadline) &&
  (event.maxParticipants === null ||
    participants < event.maxParticipants) &&
  !isRegistered;

      return {
        id: event.id,
        title: event.title,

        status: frontendStatus,

        location:
          location || "Location not specified",

        description,

        participants,

        maxParticipants:
          event.maxParticipants,

        isRegistered,

        canRegister,

        registrationDeadline:
          event.registrationDeadline?.toISOString() ?? null,

        coverImage:
          event.coverImage,

        startDate:
          event.startDate.toISOString(),

        endDate:
          event.endDate?.toISOString() ?? null,

        registeredAt: isRegistered
          ? event.eventRegistrations[0].registeredAt.toISOString()
          : null,

        program: event.program
          ? {
              id: event.program.id,
              name: event.program.name,
            }
          : null,
      };
    });

    // =====================================================
    // 5. TRANSFORM CAMPAIGNS DATA
    // =====================================================

    const formattedCampaigns = campaigns.map((campaign) => {
      return {
        id: campaign.id,

        title: campaign.title,

        description:
          campaign.description ?? "",

        raisedAmount:
          Number(campaign.raisedAmount ?? 0),

        targetAmount:
          Number(campaign.goalAmount ?? 0),

        status:
          campaign.status,

        coverImage:
          campaign.coverImage,

        startDate:
          campaign.startDate?.toISOString() ?? null,

        endDate:
          campaign.endDate?.toISOString() ?? null,

        // Currently placeholder
        supporters: 0,

        program: campaign.program
          ? {
              id: campaign.program.id,
              name: campaign.program.name,
            }
          : null,
      };
    });

    // =====================================================
    // 6. SUCCESS RESPONSE
    // =====================================================

    return NextResponse.json(
      {
        success: true,

        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },

          events: formattedEvents,

          campaigns: formattedCampaigns,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(
      "GET /api/user/events-campaigns ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load events and campaigns.",
      },
      { status: 500 }
    );
  }
}