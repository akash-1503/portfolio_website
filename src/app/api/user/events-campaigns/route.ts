import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/jwt";
import { Role } from "@prisma/client"; // Assuming you use Prisma's enum for Role

export async function GET(req: NextRequest) {
  try {
    // =====================================================
    // 1. AUTHENTICATION
    // =====================================================
    const payload = await verifyToken(req);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
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
        role: Role.USER, // Enforce stricter DB role check
        isDeleted: false,
      },
      select: {
        id: true,
        name: true, // Use fullName if your schema differs
        email: true,
        ngoId: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Access denied. Invalid user." },
        { status: 403 }
      );
    }

    if (!user.ngoId) {
      return NextResponse.json(
        { success: false, message: "No NGO association found." },
        { status: 400 }
      );
    }

    // =====================================================
    // 3. FETCH EVENTS & CAMPAIGNS (Parallel)
    // =====================================================
    const [events, campaigns] = await Promise.all([
      
      // FETCH EVENTS
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
          category: true,
          status: true,
          summary: true,
          description: true,
          venue: true,
          address: true,
          city: true,
          startDate: true,
          endDate: true,
          registrationDeadline: true, // Used for frontend state checks
          coverImage: true,
          maxParticipants: true,
          programId: true,

          _count: {
            select: true,
          },

          program: {
            select: {
              id: true,
              name: true,
            },
          },

          eventRegistrations: {
            where: {
              userId: user.id, // Current user's registration
            },
            select: {
              id: true,
              registeredAt: true,
            },
          },
        },
      }),

      // FETCH CAMPAIGNS
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
          category: true,
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

    // =====================================================
    // 4. TRANSFORM EVENTS DATA
    // =====================================================
    const formattedEvents = events.map((event) => {
      const eventRegistrations =
        (event as { eventRegistrations?: { registeredAt: Date }[] }).eventRegistrations ?? [];
      const isRegistered = eventRegistrations.length > 0;
      const frontendStatus = event.status === "ACTIVE" ? "ONGOING" : "UPCOMING";
      const eventWithCount = event as typeof event & {
        _count?: {
          registrations?: number;
          eventRegistrations?: number;
        };
      };
      const participants =
        eventWithCount._count?.registrations ??
        eventWithCount._count?.eventRegistrations ??
        0;

      const location = [event.venue, event.address, event.city]
        .filter(Boolean)
        .join(", ");

      const description =
        event.description ||
        event.summary ||
        "More information about this event will be available soon.";

      return {
        id: event.id,
        title: event.title,
        category: event.category,
        status: frontendStatus,
        location: location || "Location not specified",
        description: description,
        participants,
        maxParticipants: event.maxParticipants,
        isRegistered,
        registrationDeadline: event.registrationDeadline?.toISOString() ?? null,
        coverImage: event.coverImage,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate?.toISOString() ?? null,
        registeredAt: isRegistered
          ? eventRegistrations[0].registeredAt.toISOString()
          : null,
        program: event.program ? { id: event.program.id, name: event.program.name } : null,
      };
    });

    // =====================================================
    // 5. TRANSFORM CAMPAIGNS DATA
    // =====================================================
    const formattedCampaigns = campaigns.map((campaign) => {
      return {
        id: campaign.id,
        title: campaign.title,
        category: campaign.category,
        description: campaign.description ?? "",
        raisedAmount: Number(campaign.raisedAmount ?? 0),
        targetAmount: Number(campaign.goalAmount ?? 0),
        status: campaign.status,
        coverImage: campaign.coverImage,
        startDate: campaign.startDate?.toISOString() ?? null,
        endDate: campaign.endDate?.toISOString() ?? null,
        supporters: 0, // Placeholder until donations relation is queried
        program: campaign.program ? { id: campaign.program.id, name: campaign.program.name } : null,
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
    console.error("GET /api/user/events-campaigns ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load events and campaigns." },
      { status: 500 }
    );
  }
}