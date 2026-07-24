import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

// ============================================================================
// CUSTOM ERRORS
// ============================================================================
export class VolunteerNotFoundError extends Error {
  constructor(message = "Volunteer record not found or unauthorized for this NGO.") {
    super(message);
    this.name = "VolunteerNotFoundError";
  }
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
export interface EventResponse {
  id: string;
  title: string;
  category: string;
  eventType: string;
  summary: string;
  venue: string;
  city: string;
  state: string;
  country: string;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  coverImage: string | null;
}

export interface CampaignResponse {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  coverImage: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
}

export interface ProgramResponse {
  id: string;
  name: string;
  category: string;
  description: string;
  status: string;
  progress: number;
  budget: number;
  usedBudget: number;
  beneficiaries: number;
  coordinator: string;
  manager: string;
  location: string;
  coverImage: string | null;
  startDate: Date | null;
  endDate: Date | null;
  campaigns: CampaignResponse[];
  events: EventResponse[];
  assignedAt: Date;
}

// ============================================================================
// VOLUNTEER SERVICE
// ============================================================================
export class VolunteerService {
  
  /**
   * Locates a volunteer record based on the User ID and NGO ID.
   * Enforces security by checking the relationship and NGO scope.
   */
  static async findVolunteer(userId: string, ngoId: string) {
    const userWithVolunteer = await prisma.user.findFirst({
      where: {
        id: userId,
        ngoId: ngoId,
        role: "VOLUNTEER", // Enforce role at database level
        isDeleted: false,
      },
      include: {
        volunteer: true,
      },
    });

    if (!userWithVolunteer || !userWithVolunteer.volunteer) {
      throw new VolunteerNotFoundError();
    }

    return userWithVolunteer.volunteer;
  }

  /**
   * Retrieves all programs assigned to a specific volunteer, 
   * including nested campaigns and events.
   */
  static async getAssignedPrograms(userId: string, ngoId: string): Promise<ProgramResponse[]> {
    // 1. Find the volunteer
    const volunteer = await this.findVolunteer(userId, ngoId);

    // 2. Query the bridge table (VolunteerProgram)
    const assignedRecords = await prisma.volunteerProgram.findMany({
     where: {
    volunteerId: volunteer.id,
    program: {
        ngoId,
        isDeleted: false,
    },
},
      include: {
        program: {
          include: {
            campaigns: {
              where: { isDeleted: false },
              orderBy: { startDate: "asc" }
            },
            events: {
              where: { isDeleted: false },
              orderBy: { startDate: "asc" }
            },
          },
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    });

    // 3. Map the raw Prisma records to clean DTOs
    return assignedRecords.map((record) => this.mapProgram(record.program, record));
  }

  // ============================================================================
  // MAPPER FUNCTIONS
  // ============================================================================
  
  private static mapEvent(event: any): EventResponse {
    return {
      id: event.id,
      title: event.title || "",
      category: event.category || "General",
      eventType: event.eventType || "Event",
      summary: event.summary || "",
      venue: event.venue || "",
      city: event.city || "",
      state: event.state || "",
      country: event.country || "",
      startDate: event.startDate,
      endDate: event.endDate,
      status: event.status || "DRAFT",
      coverImage: event.coverImage || null,
    };
  }

  private static mapCampaign(campaign: any): CampaignResponse {
    return {
      id: campaign.id,
      title: campaign.title || "",
      description: campaign.description || "",
     goalAmount: Number(campaign.goalAmount),
raisedAmount: Number(campaign.raisedAmount),
      coverImage: campaign.coverImage || null,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      status: campaign.status || "DRAFT",
    };
  }

  private static mapProgram(program: any, assignmentRecord: any): ProgramResponse {
    return {
      id: program.id,
      name: program.name,
      category: program.category || "General",
      description: program.description || "",
      status: program.status || "DRAFT",
      progress: program.progress || 0,
    budget: Number(program.budget),
usedBudget: Number(program.usedBudget),
      beneficiaries: program.beneficiaries || 0,
      coordinator: program.coordinator ?? "Unassigned",
manager: program.manager ?? "Unassigned",
      location: program.location || "Multiple Locations",
      coverImage: program.coverImage || null,
      startDate: program.startDate,
      endDate: program.endDate,
      
      // Pass the arrays through their respective mappers
      campaigns: program.campaigns ? program.campaigns.map((c: any) => this.mapCampaign(c)) : [],
      events: program.events ? program.events.map((e: any) => this.mapEvent(e)) : [],
      
      // Include the assignment date from the bridge table
      assignedAt: assignmentRecord.assignedAt,
    };
  }
}