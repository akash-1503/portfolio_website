import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/jwt";

export async function GET(req: NextRequest) {
  try {
    // ============================================
    // 1. AUTHENTICATION
    // ============================================
    // Never trust frontend headers. Always verify via HttpOnly cookie/JWT.
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ============================================
    // 2. AUTHORIZATION (Role Check)
    // ============================================
    // Only regular users should access this specific read-only gallery.
    if (payload.role !== "USER") {
      return NextResponse.json(
        { success: false, message: "Access denied. Invalid role." },
        { status: 403 }
      );
    }

    // Check for NGO association
    if (!payload.ngoId) {
      return NextResponse.json(
        { success: false, message: "Bad Request: No NGO association found for this user." },
        { status: 400 }
      );
    }

    // ============================================
    // 3. DATABASE QUERY
    // ============================================
    // Fetch only non-deleted programs belonging to the user's specific NGO
    const programs = await prisma.program.findMany({
      where: {
        ngoId: payload.ngoId,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true, // Will be mapped to 'title'
        category: true,
        description: true,
        objective: true,
        location: true,
        status: true,
        coverImage: true,
        startDate: true,
        endDate: true,
        beneficiaries: true, // Keep as numeric value in DB

        // Include non-deleted campaigns mapping exactly what UI needs
        campaigns: {
          where: { isDeleted: false },
          select: {
            id: true,
            title: true,
            goalAmount: true,
            raisedAmount: true,
          },
        },

        // Include ONLY upcoming and active events for the UI list
        events: {
          where: {
            isDeleted: false,
            status: {
              in: ["UPCOMING", "ACTIVE"],
            },
          },
          select: {
            id: true,
            title: true,
            startDate: true,
            venue: true,
            city: true,
            address: true,
          },
        },

        // Fetch volunteer relations to calculate 'activeVolunteers'
        volunteers: {
          select: {
            volunteer: {
              select: {
                user: {
                  select: {
                    status: true, // Used to verify if the volunteer is currently active
                  },
                },
              },
            },
          },
        },

        // Calculate 'eventsConducted' directly in the DB using Prisma _count
        _count: {
          select: {
            events: {
              where: {
                status: "COMPLETED",
                isDeleted: false,
              },
            },
          },
        },
      },
    });

    // ============================================
    // 4. TRANSFORMATION LAYER (DTO)
    // ============================================
    // Transform the raw DB data into the exact structure the frontend UI requires
    const formattedPrograms = programs.map((program) => {
      // Calculate active volunteers (only counting those whose user account is "ACTIVE")
      const activeVolunteers = program.volunteers.filter(
        (assignment) => assignment.volunteer?.user?.status === "ACTIVE"
      ).length;

      return {
        id: program.id,
        title: program.name, // Transformed from name -> title
        category: program.category,
        description: program.description ?? "",
        objective: program.objective ?? "",
        location: program.location ?? "Location not specified",
        status: program.status,
        coverImage: program.coverImage,
        startDate: program.startDate.toISOString(),
        endDate: program.endDate?.toISOString() ?? null,

        stats: {
          beneficiaries: program.beneficiaries, // Keep raw integer
          eventsConducted: program._count.events, // Derived from Prisma _count
          activeVolunteers, // Derived from filtered array
        },

        campaigns: program.campaigns.map((camp) => ({
          id: camp.id,
          title: camp.title,
          goal: Number(camp.goalAmount),
          raised: Number(camp.raisedAmount),
        })),

        events: program.events.map((event) => ({
          id: event.id,
          title: event.title,
          date: event.startDate.toISOString(),
          time: event.startDate.toISOString(),
          location: event.venue || event.city || event.address || "Location not specified",
        })),
      };
    });

    // ============================================
    // 5. SUCCESS RESPONSE
    // ============================================
    return NextResponse.json(
      {
        success: true,
        data: formattedPrograms,
      },
      { status: 200 }
    );

  } catch (error) {
    // ============================================
    // 6. ERROR RESPONSE
    // ============================================
    // Log securely to server console, do not leak stack traces to client
    console.error("GET /api/user/programs ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load programs",
      },
      { status: 500 }
    );
  }
}