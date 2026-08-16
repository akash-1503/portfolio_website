import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/jwt";

export async function GET(req: NextRequest) {
  try {

    // =====================================================
    // 1. AUTHENTICATION
    // =====================================================

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

const payload = await verifyToken(token);

if (!payload) {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized",
    },
    { status: 401 }
  );
}

    // =====================================================
    // 2. AUTHORIZATION (Admin / Super Admin only)
    // =====================================================
    if (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Access denied. Insufficient permissions." },
        { status: 403 }
      );
    }

    if (!payload.ngoId) {
      return NextResponse.json(
        { success: false, message: "Bad Request: No NGO association found for this admin." },
        { status: 400 }
      );
    }

    // =====================================================
    // 3. CORE PRISMA QUERY (NGO Isolation)
    // =====================================================
    // Note: Adjust 'eventRegistration' and field names based on your exact Prisma schema.
    const registrations = await prisma.eventRegistration.findMany({
      where: {
        event: {
          ngoId: payload.ngoId,
          isDeleted: false,
        },
      },
      orderBy: {
        registeredAt: "desc", // Newest first
      },
      select: {
        id: true,
        registeredAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            status: true,
            startDate: true,
            venue: true,
            address: true,
            city: true,
          },
        },
      },
    });

    // =====================================================
    // 4. CALCULATE DASHBOARD STATISTICS
    // =====================================================
    
    // Calculate unique events that are upcoming or active and have registrations
    type RegistrationItem = (typeof registrations)[number];

    const upcomingEventIds = new Set(
      registrations
        .filter(
          (registration: RegistrationItem) =>
            registration.event.status === "UPCOMING"
        )
        .map((registration: RegistrationItem) => registration.event.id)
    );

    const stats = {
      totalRegistrations: registrations.length,
      upcomingEvents: upcomingEventIds.size,
      latestRegistration: registrations.length > 0 ? registrations[0].registeredAt.toISOString() : null,
    };

    // =====================================================
    // 5. TRANSFORM DATABASE DATA INTO DTO
    // =====================================================
    const formattedRegistrations = registrations.map((registration: RegistrationItem) => {
      // Intelligently combine available location fields
      const eventLocation = [
        registration.event.venue,
        registration.event.address,
        registration.event.city,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        id: registration.id,
        userName: registration.user.name ?? "Unknown User",
        userEmail: registration.user.email,
        eventName: registration.event.title,
        
        // Pass raw ISO strings; frontend handles presentation formatting
        eventDate: registration.event.startDate.toISOString(),
        eventLocation: eventLocation || "Location not specified",
        registeredAt: registration.registeredAt.toISOString(),
      };
    });

    // =====================================================
    // 6. SUCCESS RESPONSE
    // =====================================================
    return NextResponse.json(
      {
        success: true,
        data: {
          registrations: formattedRegistrations,
          stats: stats,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    // =====================================================
    // 7. ERROR HANDLING
    // =====================================================
    console.error("GET /api/admin/registrations ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load registrations.",
      },
      { status: 500 }
    );
  }
}