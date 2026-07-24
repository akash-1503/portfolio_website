import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "../../../../lib/jwt";
import { prisma } from "../../../../lib/prisma";
import { Role } from "@prisma/client";

// ============================================================================
// DTO Interfaces
// ============================================================================
interface EventDTO {
  id: string;
  title: string;
  status: string;
  date: string;
  time: string;
  venue: string;
  coordinator: string;
  description: string;
  mapUrl: string;
  volunteers: { required: number; current: number };
  checklist: any[];
  bannerColor: string;
}

interface CampaignDTO {
  id: string;
  title: string;
  status: string;
  deadline: string;
  role: string;
  goal: number;
  raised: number;
  description: string;
  volunteers: number;
  bannerColor: string;
  timeline: any[];
  tasks: any[];
  recentUpdates: any[];
}

// ============================================================================
// Date Formatting Helpers
// ============================================================================
const formatDate = (date: Date | string | null) => {
  if (!date) return "TBA";
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date: Date | string | null) => {
  if (!date) return "TBA";
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============================================================================
// GET() - Fetch all assigned Events and Campaigns for the logged-in Volunteer
// ============================================================================
export async function GET() {
  try {
    // --- 1. Authentication: Read JWT Cookie ---
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Missing authentication token." },
        { status: 401 }
      );
    }

    // --- 2. Verify JWT & Validate Payload ---
    let payload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired token." },
        { status: 401 }
      );
    }

    if (!payload || !payload.id || !payload.ngoId || !payload.role) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Malformed token payload." },
        { status: 401 }
      );
    }

    // --- 3. Authorization: Role Check ---
  if (payload.role !== Role.VOLUNTEER) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Volunteer access only." },
        { status: 403 }
      );
    }

    // --- 4. Get User & Volunteer Profiles ---
    // Fast path: findUnique by ID and manually validate scope attributes
    const userWithVolunteer = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      include: {
        volunteer: true,
      },
    });

    if (
      !userWithVolunteer ||
      userWithVolunteer.isDeleted ||
      userWithVolunteer.ngoId !== payload.ngoId ||
      !userWithVolunteer.volunteer
    ) {
      return NextResponse.json(
        { success: false, message: "Not Found: Volunteer profile not found or inactive." },
        { status: 404 }
      );
    }

    const volunteerId = userWithVolunteer.volunteer.id;

    // --- 5. Fetch Assigned Events (Optimized Includes) ---
    const assignedEventsRaw = await prisma.volunteerEvent.findMany({
      where: { volunteerId },
      include: {
        event: {
          include: {
            volunteers: true,
            program: {
              select: {
                coordinator: true,
              },
            },
          },
        },
      },
    });

    // --- 6. Fetch Assigned Campaigns (Derived via Programs) ---
    const assignedProgramsRaw = await prisma.volunteerProgram.findMany({
      where: { volunteerId },
      include: {
        program: {
          include: {
            campaigns: {
              where: { isDeleted: false },
              include: {
                events: {
                  include: {
                    volunteers: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // --- 7. Map Data to DTOs ---

    // Process Events
    const events: EventDTO[] = assignedEventsRaw
      .map((ve) => ve.event)
      .filter((ev) => ev && !ev.isDeleted)
      .map((ev) => {
        const status = ev.status;
        let bannerColor = "bg-gray-100";

        if (status === "ACTIVE") bannerColor = "bg-green-100";
        else if (status === "UPCOMING") bannerColor = "bg-blue-100";
        else if (status === "COMPLETED") bannerColor = "bg-purple-100";
        else if (status === "CANCELLED") bannerColor = "bg-red-100";

        return {
          id: ev.id,
          title: ev.title || "Unnamed Event",
          status: status,
          date: formatDate(ev.startDate),
          time: ev.startDate && ev.endDate
            ? `${formatTime(ev.startDate)} - ${formatTime(ev.endDate)}`
            : "TBA",
          venue: ev.venue || "TBA",
          coordinator: ev.program?.coordinator ?? "Event Coordinator",
          description: ev.description || "",
          mapUrl: ev.googleMapUrl || `https://maps.google.com/?q=${encodeURIComponent(ev.venue || "")}`,
          volunteers: {
            required: ev.maxVolunteers || 0,
            current: ev.volunteers?.length || 0,
          },
          checklist: [], // Temporary placeholder
          bannerColor,
        };
      });

    // Process Campaigns (Deduplicating derived campaigns using a Typed Map)
    const campaignsMap = new Map<string, CampaignDTO>();

    assignedProgramsRaw.forEach((vp) => {
      if (!vp.program || vp.program.isDeleted) return;

      vp.program.campaigns.forEach((campaign) => {
        if (!campaignsMap.has(campaign.id)) {
          const status = campaign.status || "DRAFT";
          let bannerColor = "bg-gray-100";
          
          if (status === "ACTIVE") bannerColor = "bg-green-100";
          else if (status === "DRAFT") bannerColor = "bg-blue-100";

          // Calculate unique volunteers assigned to events within this campaign
          const uniqueVolunteers = new Set<string>();
          if (campaign.events) {
            campaign.events.forEach((e) => {
              e.volunteers?.forEach((v) => uniqueVolunteers.add(v.volunteerId));
            });
          }

          campaignsMap.set(campaign.id, {
            id: campaign.id,
            title: campaign.title || "Unnamed Campaign",
            status: status,
            deadline: campaign.endDate ? formatDate(campaign.endDate) : "Ongoing",
            role: "Volunteer",
            goal: Number(campaign.goalAmount || 0),     // Cast Decimal to Number
            raised: Number(campaign.raisedAmount || 0), // Cast Decimal to Number
            description: campaign.description || "",
            volunteers: uniqueVolunteers.size,
            bannerColor,
            timeline: [],       // Temporary placeholder
            tasks: [],          // Temporary placeholder
            recentUpdates: [],  // Temporary placeholder
          });
        }
      });
    });

    const campaigns = Array.from(campaignsMap.values());

    // --- 8. Return Response ---
    return NextResponse.json(
      {
        success: true,
        message: "Volunteer activities fetched successfully.",
        data: {
          events,
          campaigns,
        },
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    // --- 9. Catch Block ---
    console.error("[GET_VOLUNTEER_ACTIVITIES_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}